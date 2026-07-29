import type { RedirectRequest } from "@azure/msal-browser";
import { msalInstance } from "./msalInstance";
import { dataverseTokenRequest, mailTokenRequest } from "./msalConfig";

async function acquireAccessToken(tokenRequest: RedirectRequest): Promise<string> {
  const account = msalInstance.getActiveAccount();
  try {
    const result = await msalInstance.acquireTokenSilent({ ...tokenRequest, account });
    return result.accessToken;
  } catch {
    await msalInstance.acquireTokenRedirect(tokenRequest);
    throw new Error("Redirecting for interactive auth");
  }
}

export const getDataverseAccessToken = () => acquireAccessToken(dataverseTokenRequest);
export const getMailAccessToken = () => acquireAccessToken(mailTokenRequest);
