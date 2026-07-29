import type { Configuration, RedirectRequest } from "@azure/msal-browser";

const redirectUri = import.meta.env.VITE_REDIRECT_URI || window.location.origin;

export const msalConfig: Configuration = {
  auth: {
    clientId: import.meta.env.VITE_AZURE_CLIENT_ID,
    authority: `https://login.microsoftonline.com/${import.meta.env.VITE_AZURE_TENANT_ID}`,
    redirectUri,
    postLogoutRedirectUri: redirectUri,
  },
  cache: {
    cacheLocation: "sessionStorage",
  },
};

export const loginRequest: RedirectRequest = {
  scopes: ["openid", "profile", "User.Read"],
};

export const dataverseTokenRequest: RedirectRequest = {
  scopes: [import.meta.env.VITE_DATAVERSE_SCOPE],
};

export const mailTokenRequest: RedirectRequest = {
  scopes: ["Mail.ReadWrite"],
};
