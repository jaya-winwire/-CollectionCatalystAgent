// Actual shape returned by the flow (subject/body/RHId), not the cca_* column
// names originally expected.
export interface EmailDraftResult {
  subject: string;
  body: string;
  RHId: string;
}

// Calls our backend proxy (server/index.js), which holds the real Power
// Automate flow URL and signature server-side — the browser never sees it.
export async function generateEmailDraft(accountId: string): Promise<EmailDraftResult> {
  const response = await fetch("/api/generate-email-draft", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ accountId }),
  });

  if (!response.ok) {
    throw new Error(`Email draft request failed: ${response.status} ${await response.text()}`);
  }

  return response.json();
}
