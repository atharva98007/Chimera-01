import {
  AGENTIC_ENDPOINT,
  EMAIL_SCAN_ENDPOINT,
  SANDBOX_ENDPOINT,
  URL_SCAN_ENDPOINT,
} from "@/lib/api-config";
import type { EmailEvaluation } from "@/lib/email-engine";
import type { ScanEvaluation, ScanRiskClass } from "@/lib/scan-engine";

type FeatureDetail = { score?: number; message?: string };

type UnifiedScanResponse = {
  composite_score?: number;
  latency_ms?: number;
  layer_scores?: Record<string, number | null>;
  details?: Record<string, FeatureDetail | undefined>;
};

type EmailScanResponse = {
  risk_score?: number;
  verdict?: string;
  label?: string;
  confidence?: number | null;
  details?: Record<string, string>;
};

type AgenticResponse = {
  target_url?: string;
  consensus_reached?: boolean;
  latency_ms?: number;
  sub_agent_claims?: Record<
    string,
    { claim?: string; confidence?: number; evidence?: string[] }
  >;
  final_evaluation?: {
    final_verdict?: string;
    verdict?: string;
    risk_score?: number;
    verdict_justification?: string;
    justification?: string;
    confidence_score?: number;
  };
};

type SandboxResponse = {
  verdict?: string;
  confidence?: number;
  indicators?: string[];
  source?: string;
  raw?: {
    page_title?: string;
    total_network_connections?: number;
    error?: string;
  };
};

export type SandboxVerdict = "clean" | "suspicious" | "malicious" | "unknown";

export type SandboxScanResult = {
  url: string;
  verdict: SandboxVerdict;
  confidence: number;
  pageTitle?: string;
  networkConnections?: number;
  indicators: string[];
  note?: string;
};

export type AgenticScanResult = {
  targetUrl: string;
  consensusReached: boolean;
  latencyMs?: number;
  finalVerdict: string;
  justification?: string;
  agents: { name: string; claim: string; confidence: number }[];
};

async function postJson<T>(url: string, body: unknown): Promise<T> {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    let detail = res.statusText;
    try {
      const err = (await res.json()) as { detail?: unknown };
      detail =
        typeof err.detail === "string"
          ? err.detail
          : JSON.stringify(err.detail ?? err);
    } catch {
      /* ignore parse errors */
    }
    throw new Error(detail || `Request failed (${res.status})`);
  }

  return res.json() as Promise<T>;
}

function riskFromScore(riskScore: number): {
  riskClass: ScanRiskClass;
  riskLevel: string;
  headline: string;
} {
  if (riskScore >= 80) {
    return {
      riskClass: "danger",
      riskLevel: "Critical Risk",
      headline: "Malicious / Phishing Detected",
    };
  }
  if (riskScore >= 40) {
    return {
      riskClass: "warning",
      riskLevel: "Suspicious",
      headline: "Suspicious URL Detected",
    };
  }
  return {
    riskClass: "safe",
    riskLevel: "Safe / Verified",
    headline: "Safe / Verified",
  };
}

function layerState(value: number | null | undefined): "pass" | "warn" | "fail" {
  if (value == null) return "pass";
  if (value > 0.5) return "fail";
  if (value > 0.2) return "warn";
  return "pass";
}

function detailState(
  score: number,
  message: string
): "pass" | "warn" | "fail" | "unavailable" {
  if (/unavailable|offline|skipped|error/i.test(message)) return "unavailable";
  if (score > 0.5) return "fail";
  if (score > 0.2) return "warn";
  return "pass";
}

const LAYER_LABELS: Record<string, string> = {
  layer_1_lexical: "Lexical heuristics",
  layer_2_network: "Network topology",
  layer_3_crypto: "Certificate & crypto",
  layer_4_sandbox: "Sandbox behavior",
  layer_5_context: "Contextual signals",
};

export function mapUnifiedScanResponse(
  scannedUrl: string,
  data: UnifiedScanResponse
): ScanEvaluation {
  const riskScore = Math.round((data.composite_score ?? 0) * 100);
  const safetyScore = Math.max(0, 100 - riskScore);
  const { riskClass, riskLevel, headline } = riskFromScore(riskScore);
  const malicious = riskScore >= 40;

  const flags: string[] = [];
  if (malicious && data.layer_scores) {
    for (const [key, value] of Object.entries(data.layer_scores)) {
      if (value != null && value > 0.5) {
        const label = LAYER_LABELS[key] ?? key.replace(/_/g, " ");
        flags.push(`${label}: ${Math.round(value * 100)}% risk signal`);
      }
    }
  }

  const details: ScanEvaluation["details"] = {};

  if (data.details) {
    for (const [key, feat] of Object.entries(data.details)) {
      if (!feat?.message && feat?.score == null) continue;
      const score = feat.score ?? 0;
      const state = detailState(score, feat.message ?? "");
      details[key] = {
        message: feat.message ?? key.replace(/_/g, " "),
        score,
        status: state,
      };
    }
  }

  if (data.layer_scores) {
    for (const [key, value] of Object.entries(data.layer_scores)) {
      if (value == null || details[key]) continue;
      const label = LAYER_LABELS[key] ?? key.replace(/_/g, " ");
      const state = layerState(value);
      details[key] = {
        message: `${label} — ${Math.round(value * 100)}% risk contribution`,
        score: value,
        status: state,
      };
    }
  }

  return {
    verdict: malicious ? "malicious" : "safe",
    scannedUrl,
    riskScore,
    safetyScore,
    riskLevel,
    riskClass,
    headline,
    summary: malicious
      ? `Unified fusion scored ${riskScore}% phishing risk across active ML and heuristic layers.`
      : `Unified fusion scored ${riskScore}% phishing risk. No critical threats detected.`,
    flags,
    details,
    layerScores: data.layer_scores,
    latencyMs: data.latency_ms,
  };
}

function extractSenderDomain(from: string): string {
  const match = from.match(/@([^>\s]+)/);
  return match?.[1]?.toLowerCase() ?? "unknown.com";
}

function buildEmailRawText(input: {
  subject: string;
  from: string;
  body: string;
  headers?: string;
}): string {
  const lines: string[] = [];
  if (input.from.trim()) lines.push(`From: ${input.from.trim()}`);
  if (input.subject.trim()) lines.push(`Subject: ${input.subject.trim()}`);
  if (input.headers?.trim()) lines.push(input.headers.trim());
  if (input.body.trim()) {
    if (lines.length) lines.push("");
    lines.push(input.body.trim());
  }
  return lines.join("\n");
}

export function mapEmailScanResponse(
  data: EmailScanResponse,
  input: { subject: string; from: string; body: string }
): EmailEvaluation {
  const phishingScore = Math.round(data.risk_score ?? 0);
  const safetyScore = Math.max(0, 100 - phishingScore);
  const verdictUpper = (data.verdict ?? "").toUpperCase();
  const malicious = phishingScore > 70;

  const flags = data.details ? Object.values(data.details).filter(Boolean) : [];
  const combined = `${input.subject} ${input.body}`.toLowerCase();
  const spamKeywords = [
    "urgent",
    "immediate",
    "suspended",
    "verify",
    "click here",
    "winner",
    "password",
    "bank",
    "paypal",
  ].filter((w) => combined.includes(w));
  const suspiciousLinks = (input.body.match(/https?:\/\/[^\s<>"']+/gi) ?? []).filter(
    (l) => /bit\.ly|tinyurl|t\.co|ngrok|\.xyz|secure-login|verify/i.test(l)
  );

  return {
    verdict: malicious ? "malicious" : "safe",
    phishingScore,
    safetyScore,
    riskLevel:
      verdictUpper === "PHISHING"
        ? "Critical Risk"
        : verdictUpper === "SUSPICIOUS"
          ? "Suspicious"
          : data.label === "Spam"
            ? "Suspicious"
            : "Low Risk",
    headline: malicious ? "Phishing / Malicious Email" : "Safe / Verified",
    summary: malicious
      ? "The email scanner flagged spam or phishing patterns in language, links, or sender profile."
      : "No critical phishing indicators detected by the live email analysis engine.",
    flags,
    spamKeywords,
    suspiciousLinks,
  };
}

export function normalizeScanUrl(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return trimmed;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

export async function scanUrl(url: string): Promise<ScanEvaluation> {
  const normalized = normalizeScanUrl(url);
  const data = await postJson<UnifiedScanResponse>(URL_SCAN_ENDPOINT, { url: normalized });
  return mapUnifiedScanResponse(normalized, data);
}

export async function scanEmail(input: {
  subject: string;
  from: string;
  body: string;
  headers?: string;
}): Promise<EmailEvaluation> {
  const raw_text = buildEmailRawText(input);
  if (!raw_text.trim()) {
    throw new Error("Email content is empty.");
  }

  const data = await postJson<EmailScanResponse>(EMAIL_SCAN_ENDPOINT, {
    message_id: `msg_${Date.now()}`,
    sender_domain: extractSenderDomain(input.from),
    display_name: input.subject.trim() || "No Subject",
    raw_text,
  });

  return mapEmailScanResponse(data, input);
}

function looksLikeUrl(value: string): boolean {
  try {
    const parsed = new URL(value.startsWith("http") ? value : `https://${value}`);
    return Boolean(parsed.hostname);
  } catch {
    return false;
  }
}

function normalizeUrl(value: string): string {
  const trimmed = value.trim();
  return trimmed.startsWith("http") ? trimmed : `https://${trimmed}`;
}

export async function runAgenticScan(target: string): Promise<AgenticScanResult> {
  const trimmed = target.trim();
  const isUrl = looksLikeUrl(trimmed);

  const payload = isUrl
    ? {
        url: normalizeUrl(trimmed),
        sender: "analyst@chimera.local",
        email_body: `Agentic investigation initiated for URL: ${trimmed}`,
      }
    : {
        url: "https://example.com",
        sender: "unknown@investigation.local",
        email_body: trimmed,
      };

  const data = await postJson<AgenticResponse>(AGENTIC_ENDPOINT, payload);
  const finalEval = data.final_evaluation;

  return {
    targetUrl: data.target_url ?? payload.url,
    consensusReached: Boolean(data.consensus_reached),
    latencyMs: data.latency_ms,
    finalVerdict: finalEval?.final_verdict ?? finalEval?.verdict ?? "UNKNOWN",
    justification: finalEval?.verdict_justification ?? finalEval?.justification,
    agents: Object.entries(data.sub_agent_claims ?? {}).map(([name, claim]) => ({
      name,
      claim: claim.claim ?? "unknown",
      confidence: Math.round((claim.confidence ?? 0) * 100),
    })),
  };
}

function parseSandboxVerdict(raw?: string): SandboxVerdict {
  const v = (raw ?? "").toLowerCase();
  if (v.includes("malicious") || v.includes("critical")) return "malicious";
  if (v.includes("suspicious") || v.includes("warn")) return "suspicious";
  if (v.includes("clean") || v.includes("safe")) return "clean";
  return "unknown";
}

export async function runSandboxScan(target: string): Promise<SandboxScanResult> {
  const trimmed = target.trim();
  const url = looksLikeUrl(trimmed) ? normalizeUrl(trimmed) : `https://${trimmed}`;

  const data = await postJson<SandboxResponse>(SANDBOX_ENDPOINT, { url });

  return {
    url,
    verdict: parseSandboxVerdict(data.verdict),
    confidence: Math.round((data.confidence ?? 0) * 100),
    pageTitle: data.raw?.page_title,
    networkConnections: data.raw?.total_network_connections,
    indicators: data.indicators ?? [],
    note: data.raw?.error,
  };
}
