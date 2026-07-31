export interface ApproveSendEmailRequest {
  RId: string;
  accessToken: string;
  sendTo: string;
}

// Calls our backend proxy (server/index.js), which holds the real Power
// Automate flow URL and signature server-side — the browser never sees it.
export async function approveSendEmail(request: ApproveSendEmailRequest): Promise<void> {
  const response = await fetch("/api/approve-send-email", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error(`Approve & send request failed: ${response.status} ${await response.text()}`);
  }
}
