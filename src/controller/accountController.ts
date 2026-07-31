import { fetchCcaAccounts, type CcaAccount } from "../dataversedata/cca_account";

export async function getAccounts(): Promise<CcaAccount[]> {
  return fetchCcaAccounts();
}
