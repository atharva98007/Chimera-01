export type ScanStatus = "idle" | "connecting" | "analyzing" | "done";

export interface TerminalLog {
  id: string;
  at: number;
  message: string;
  phase: ScanStatus;
}

export const TIMELINE_LOGS: Omit<TerminalLog, "id">[] = [
  { at: 0, phase: "connecting", message: "0ms: Initializing Chimera threat relay..." },
  { at: 80, phase: "connecting", message: "80ms: Handshake with analysis mesh..." },
  { at: 180, phase: "connecting", message: "180ms: Resolving DNS & CDN topology..." },
  { at: 320, phase: "connecting", message: "320ms: Endpoint reachable — uplink stable" },
  { at: 400, phase: "analyzing", message: "400ms: Checking SSL certificate chain..." },
  { at: 520, phase: "analyzing", message: "520ms: Parsing TLS cipher suite profile..." },
  { at: 680, phase: "analyzing", message: "680ms: Deconstructing domain payload..." },
  { at: 840, phase: "analyzing", message: "840ms: Evaluating homoglyph vectors..." },
  { at: 1020, phase: "analyzing", message: "1020ms: Cross-referencing global blacklist DB..." },
  { at: 1180, phase: "analyzing", message: "1180ms: Mapping redirect behavior graph..." },
  { at: 1340, phase: "analyzing", message: "1340ms: Running ML risk classifier..." },
  { at: 1520, phase: "analyzing", message: "1520ms: Verifying favicon fingerprint..." },
  { at: 1680, phase: "analyzing", message: "1680ms: Scanning fast-flux DNS patterns..." },
  { at: 1860, phase: "analyzing", message: "1860ms: Compiling heuristic verdict matrix..." },
  { at: 2100, phase: "done", message: "2100ms: Scan complete — rendering threat card" },
];

export const TOTAL_SCAN_MS = 2200;
