import { dvGet } from "../auth/dataverseClient";

export interface CcaPaymentHistory {
  cca_pid: string;
  cca_paymentdate: string;
  cca_amount: number;
  cca_method: string;
  _cca_accountid_value: string;
  _cca_invoice_value: string;
}

// Dataverse's default entity set name for a custom table is the logical name
// pluralized with "s". Update this if the table's actual entity set name differs.
const ENTITY_SET = "cca_paymenthistories";

const COLUMNS: (keyof CcaPaymentHistory)[] = [
  "cca_pid",
  "cca_paymentdate",
  "cca_amount",
  "cca_method",
  "_cca_accountid_value",
  "_cca_invoice_value",
];

export async function fetchCcaPaymentHistories(): Promise<CcaPaymentHistory[]> {
  const query = `${ENTITY_SET}?$select=${COLUMNS.join(",")}`;
  const result = await dvGet(query);
  return result?.value ?? [];
}
