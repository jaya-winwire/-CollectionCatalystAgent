import { dvGet } from "../auth/dataverseClient";

export interface CcaAccount {
  cca_accountid: string;
  cca_aid: string;
  cca_customername: string;
  cca_customerinitial: string;
  cca_industrytype: string;
  cca_customercode: string;
  cca_email: string;
  cca_phone: string;
  cca_address: string;
  cca_currentbalance: number;
  cca_creditlimit: number;
  cca_overdueamount: number;
  cca_riskscore: number;
  cca_priority: string;
  cca_reason: string;
  cca_approvername: string;
  cca_aprroverinitial: string;
  cca_status: string;
  cca_brokenpromisecount: number;
}

// Dataverse's default entity set name for a custom table is the logical name
// pluralized with "s". Update this if the table's actual entity set name differs.
const ENTITY_SET = "cca_accounts";

const COLUMNS: (keyof CcaAccount)[] = [
  "cca_accountid",
  "cca_aid",
  "cca_customername",
  "cca_customerinitial",
  "cca_industrytype",
  "cca_customercode",
  "cca_email",
  "cca_phone",
  "cca_address",
  "cca_currentbalance",
  "cca_creditlimit",
  "cca_overdueamount",
  "cca_riskscore",
  "cca_priority",
  "cca_reason",
  "cca_approvername",
  "cca_aprroverinitial",
  "cca_status",
  "cca_brokenpromisecount",
];

export async function fetchCcaAccounts(): Promise<CcaAccount[]> {
  const query = `${ENTITY_SET}?$select=${COLUMNS.join(",")}`;
  const result = await dvGet(query);
  return result?.value ?? [];
}
