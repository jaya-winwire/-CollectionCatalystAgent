import { getDataverseAccessToken } from "./dataverseAuth";

const DATAVERSE_API_URL = import.meta.env.VITE_DATAVERSE_API_URL;

async function dvRequest(path: string, init: RequestInit = {}) {
  const token = await getDataverseAccessToken();
  const response = await fetch(`${DATAVERSE_API_URL}/${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
      "OData-MaxVersion": "4.0",
      "OData-Version": "4.0",
      ...init.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`Dataverse request failed: ${response.status} ${await response.text()}`);
  }

  return response.status === 204 ? null : response.json();
}

export const dvGet = (path: string) => dvRequest(path, { method: "GET" });

export const dvPost = (path: string, body: unknown) =>
  dvRequest(path, { method: "POST", body: JSON.stringify(body) });

export const dvPatch = (path: string, body: unknown) =>
  dvRequest(path, { method: "PATCH", body: JSON.stringify(body) });
