import { dvGet } from "../auth/dataverseClient";

export interface CcaInvoice {
  cca_invoiceid: string;
  cca_iid: string;
  cca_invoicenumber: string;
  cca_invoiceamount: number;
  cca_duedate: string;
  cca_daysoverdue: number;
  cca_status: string;
  _cca_accountid_value: string;
}

// Dataverse's default entity set name for a custom table is the logical name
// pluralized with "s". Update this if the table's actual entity set name differs.
const ENTITY_SET = "cca_invoices";

const COLUMNS: (keyof CcaInvoice)[] = [
  "cca_invoiceid",
  "cca_iid",
  "cca_invoicenumber",
  "cca_invoiceamount",
  "cca_duedate",
  "cca_daysoverdue",
  "cca_status",
  "_cca_accountid_value",
];

export async function fetchCcaInvoices(): Promise<CcaInvoice[]> {
  const query = `${ENTITY_SET}?$select=${COLUMNS.join(",")}`;
  const result = await dvGet(query);
  return result?.value ?? [];
}
