import type { ScanStatus } from "@/lib/scan-timeline";

export interface EmailTerminalLog {
  id: string;
  at: number;
  message: string;
  phase: ScanStatus;
}

export const EMAIL_TIMELINE: Omit<EmailTerminalLog, "id">[] = [
  { at: 0, phase: "connecting", message: "0ms: Opening MIME parser channel..." },
  { at: 100, phase: "connecting", message: "100ms: Normalizing header block..." },
  { at: 280, phase: "connecting", message: "280ms: Sender reputation lookup..." },
  { at: 380, phase: "analyzing", message: "380ms: Tokenizing body for urgency cues..." },
  { at: 520, phase: "analyzing", message: "520ms: Extracting embedded URLs..." },
  { at: 700, phase: "analyzing", message: "700ms: SPF/DKIM heuristic pass..." },
  { at: 900, phase: "analyzing", message: "900ms: ML tone classifier running..." },
  { at: 1100, phase: "analyzing", message: "1100ms: Cross-checking threat feeds..." },
  { at: 1300, phase: "analyzing", message: "1300ms: Building composite risk score..." },
  { at: 1600, phase: "done", message: "1600ms: Email verdict ready" },
];

export const EMAIL_SCAN_MS = 1700;
