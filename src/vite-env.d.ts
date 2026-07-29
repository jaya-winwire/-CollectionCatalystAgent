/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_AZURE_CLIENT_ID: string;
  readonly VITE_AZURE_TENANT_ID: string;
  readonly VITE_REDIRECT_URI: string;
  readonly VITE_DATAVERSE_SCOPE: string;
  readonly VITE_DATAVERSE_API_URL: string;
  readonly VITE_COPILOT_WEBCHAT_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
