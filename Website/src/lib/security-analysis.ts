import type { LucideIcon } from "lucide-react";
import {
  Code2,
  FolderOpen,
  Globe,
  Image,
  Lock,
  Network,
  GitBranch,
} from "lucide-react";
import type { ScanEvaluation } from "@/lib/scan-engine";

export type AnalysisCardState = "pass" | "warn" | "fail" | "unavailable";

export type SecurityAnalysisCard = {
  id: string;
  title: string;
  message: string;
  state: AnalysisCardState;
  icon: LucideIcon;
};

type CardDef = {
  id: string;
  title: string;
  icon: LucideIcon;
  keys: string[];
  riskLabel: string;
  phishingRisk?: boolean;
};

const CARD_DEFS: CardDef[] = [
  {
    id: "ssl",
    title: "SSL Certificate",
    icon: Lock,
    keys: ["ssl_presence_and_validity", "layer_3_crypto"],
    riskLabel: "Crypto/SSL Handshake",
  },
  {
    id: "threat",
    title: "Threat Intel",
    icon: Globe,
    keys: ["threat_intelligence", "layer_5_context"],
    riskLabel: "Global Threat Intel",
  },
  {
    id: "favicon",
    title: "Favicon Match",
    icon: Image,
    keys: ["favicon_mismatch", "cnn_visual_analysis"],
    riskLabel: "V2 Vision",
  },
  {
    id: "obfuscation",
    title: "Obfuscation",
    icon: Code2,
    keys: ["obfuscation_analysis", "layer_4_sandbox"],
    riskLabel: "Sandbox Payload",
  },
  {
    id: "flux",
    title: "DNS Fast Flux",
    icon: Network,
    keys: ["fast_flux_dns", "layer_2_network"],
    riskLabel: "Network Footprint",
  },
  {
    id: "structure",
    title: "URL Structure",
    icon: GitBranch,
    keys: ["url_structure_analysis", "xgboost_analysis"],
    riskLabel: "XGBoost Match",
    phishingRisk: true,
  },
  {
    id: "path",
    title: "Path Analysis",
    icon: FolderOpen,
    keys: ["path_anomaly_detection", "layer_1_lexical"],
    riskLabel: "Lexical Anomaly",
  },
];

function formatMessage(raw: string): string {
  return raw.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function scoreToState(score: number, message: string): AnalysisCardState {
  if (/unavailable|offline|skipped|error/i.test(message)) return "unavailable";
  if (score > 0.5) return "fail";
  if (score > 0.2) return "warn";
  return "pass";
}

function layerPct(value: number): number {
  return Math.round(value * 100);
}

function resolveCard(def: CardDef, result: ScanEvaluation): SecurityAnalysisCard {
  for (const key of def.keys) {
    const detail = result.details[key];
    if (detail) {
      const state = detail.status ?? scoreToState(detail.score, detail.message);
      if (state === "unavailable") {
        return {
          id: def.id,
          title: def.title,
          message: formatMessage(detail.message),
          state,
          icon: def.icon,
        };
      }

      const pct =
        detail.score <= 1 ? Math.round(detail.score * 1000) / 10 : Math.round(detail.score);
      const message = def.phishingRisk
        ? `${def.riskLabel}: ${pct}% Phishing Risk`
        : `${def.riskLabel}: ${pct}% Risk Profile`;

      return { id: def.id, title: def.title, message, state, icon: def.icon };
    }

    const layerValue = result.layerScores?.[key];
    if (layerValue != null) {
      const pct = layerPct(layerValue);
      const state = scoreToState(layerValue, "");
      const message = def.phishingRisk
        ? `${def.riskLabel}: ${pct}% Phishing Risk`
        : `${def.riskLabel}: ${pct}% Risk Profile`;

      return { id: def.id, title: def.title, message, state, icon: def.icon };
    }
  }

  return {
    id: def.id,
    title: def.title,
    message: `${def.riskLabel}: Pending`,
    state: "pass",
    icon: def.icon,
  };
}

export function buildSecurityAnalysisCards(result: ScanEvaluation): SecurityAnalysisCard[] {
  return CARD_DEFS.map((def) => resolveCard(def, result));
}
