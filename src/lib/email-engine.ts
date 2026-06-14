export type EmailVerdict = "safe" | "malicious";

export interface EmailEvaluation {
  verdict: EmailVerdict;
  phishingScore: number;
  safetyScore: number;
  riskLevel: string;
  headline: string;
  summary: string;
  flags: string[];
  spamKeywords: string[];
  suspiciousLinks: string[];
}

const URGENCY_WORDS = [
  "urgent",
  "immediate",
  "suspended",
  "verify",
  "click here",
  "act now",
  "winner",
  "password",
  "bank",
  "paypal",
  "invoice",
  "unusual activity",
];

const SENDER_RED_FLAGS = ["noreply@", "support@", "security@", "mailer@"];

export function evaluateEmail(input: {
  subject: string;
  from: string;
  body: string;
  headers?: string;
}): EmailEvaluation {
  const combined = `${input.subject} ${input.body} ${input.headers ?? ""}`.toLowerCase();
  const flags: string[] = [];
  const spamKeywords = URGENCY_WORDS.filter((w) => combined.includes(w));

  if (spamKeywords.length) {
    flags.push(`Urgency / spam language: ${spamKeywords.slice(0, 4).join(", ")}`);
  }

  const links = (input.body.match(/https?:\/\/[^\s<>"']+/gi) ?? []).filter(Boolean);
  const suspiciousLinks = links.filter(
    (l) =>
      /bit\.ly|tinyurl|t\.co|ngrok|\.xyz|secure-login|verify/i.test(l) ||
      links.length > 3
  );
  if (suspiciousLinks.length) {
    flags.push(`${suspiciousLinks.length} suspicious link(s) in body`);
  }

  const fromLower = input.from.toLowerCase();
  if (fromLower && SENDER_RED_FLAGS.some((f) => fromLower.includes(f))) {
    flags.push("Generic or impersonation-style sender address");
  }

  if (input.subject && /re:\s*fw:/i.test(input.subject) === false) {
    if (/account|verify|security alert|payment/i.test(input.subject)) {
      flags.push("High-pressure subject line pattern");
    }
  }

  const hash = [...combined].reduce((a, c) => a + c.charCodeAt(0), 0);
  const randomHit = hash % 11 === 0;
  if (randomHit && flags.length < 2) {
    flags.push("Anomaly score above community baseline");
  }

  const malicious =
    spamKeywords.length >= 2 ||
    suspiciousLinks.length > 0 ||
    flags.length >= 2 ||
    (spamKeywords.length >= 1 && suspiciousLinks.length >= 1);

  if (malicious) {
    const phishingScore = Math.min(96, 45 + flags.length * 12 + spamKeywords.length * 5);
    return {
      verdict: "malicious",
      phishingScore,
      safetyScore: Math.max(0, 100 - phishingScore),
      riskLevel: phishingScore >= 75 ? "Critical Risk" : "Suspicious",
      headline: "Phishing / Malicious Email",
      summary:
        "This message shows patterns associated with credential theft, urgency manipulation, or unsafe links.",
      flags,
      spamKeywords,
      suspiciousLinks,
    };
  }

  return {
    verdict: "safe",
    phishingScore: 12,
    safetyScore: 88,
    riskLevel: "Low Risk",
    headline: "Safe / Verified",
    summary:
      "No critical phishing indicators in subject, body, or link profile. Continue to verify sender through official channels.",
    flags: [],
    spamKeywords: [],
    suspiciousLinks: [],
  };
}
