import { dvGet } from "../auth/dataverseClient";

export interface CcaPaymentPlan {
  cca_ppid: string;
  _cca_accountid_value: string;
  cca_monthlyamount: number;
  cca_duration: number;
}

// Dataverse's default entity set name for a custom table is the logical name
// pluralized with "s". Update this if the table's actual entity set name differs.
const ENTITY_SET = "cca_paymentplans";

const COLUMNS: (keyof CcaPaymentPlan)[] = [
  "cca_ppid",
  "_cca_accountid_value",
  "cca_monthlyamount",
  "cca_duration",
];

export async function fetchCcaPaymentPlans(): Promise<CcaPaymentPlan[]> {
  const query = `${ENTITY_SET}?$select=${COLUMNS.join(",")}`;
  const result = await dvGet(query);
  return result?.value ?? [];
}
