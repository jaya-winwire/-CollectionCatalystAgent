import { fetchCcaInvoices, type CcaInvoice } from "../dataversedata/cca_invoice";
import { fetchCcaAccounts } from "../dataversedata/cca_account";

export async function getInvoices(): Promise<CcaInvoice[]> {
  return fetchCcaInvoices();
}

export function countInvoicesByAccountId(invoices: CcaInvoice[]): Record<string, number> {
  return invoices.reduce((counts, invoice) => {
    const accountId = invoice._cca_accountid_value ?? "unknown";
    counts[accountId] = (counts[accountId] ?? 0) + 1;
    return counts;
  }, {} as Record<string, number>);
}

export async function getInvoiceCountsByAccount(): Promise<Record<string, number>> {
  const invoices = await fetchCcaInvoices();
  return countInvoicesByAccountId(invoices);
}

export interface AccountInvoiceCount {
  accountId: string;
  accountName: string;
  invoiceCount: number;
}

export async function getInvoiceCountsByAccountName(): Promise<AccountInvoiceCount[]> {
  const [invoices, accounts] = await Promise.all([fetchCcaInvoices(), fetchCcaAccounts()]);
  const counts = countInvoicesByAccountId(invoices);
  const accountsById = new Map(accounts.map((account) => [account.cca_accountid, account]));

  return Object.entries(counts).map(([accountId, invoiceCount]) => ({
    accountId,
    accountName: accountsById.get(accountId)?.cca_customername ?? "Unknown Account",
    invoiceCount,
  }));
}
