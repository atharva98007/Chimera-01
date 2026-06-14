export const URL_SCAN_ENDPOINT =
  process.env.NEXT_PUBLIC_URL_SCAN_ENDPOINT ??
  "https://chimera-phishing-server-main.hf.space/predict/unified";

export const EMAIL_SCAN_ENDPOINT =
  process.env.NEXT_PUBLIC_EMAIL_SCAN_ENDPOINT ??
  "https://chimera-phishing-server-main.hf.space/scan/email";

export const AGENTIC_ENDPOINT =
  process.env.NEXT_PUBLIC_AGENTIC_ENDPOINT ??
  "https://chimera-phishing-server-main.hf.space/api/v5/predict";

export const SANDBOX_ENDPOINT =
  process.env.NEXT_PUBLIC_SANDBOX_ENDPOINT ??
  "https://chimera-phishing-server-main.hf.space/api/v6/sandbox";

/** @deprecated Use URL_SCAN_ENDPOINT */
export const SCAN_API = URL_SCAN_ENDPOINT;
