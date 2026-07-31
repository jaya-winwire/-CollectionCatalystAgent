import { fetchCcaAccounts } from "../dataversedata/cca_account";
import { fetchCcaInvoices } from "../dataversedata/cca_invoice";

const OPEN_STATUSES = ["overdue", "partial", "pending"];

export interface DashboardCustomer {
  id: string;
  customer: string;
  initials: string;
  outstandingBalance: number;
  openInvoices: number;
  daysOverdue: number;
  riskScore: number;
  priority: string;
  collectionStatus: string;
  owner: string;
  ownerInitials: string;
  aiReason: string;
}

export async function getDashboardCustomers(): Promise<DashboardCustomer[]> {
  const [accounts, invoices] = await Promise.all([fetchCcaAccounts(), fetchCcaInvoices()]);

  return accounts.map((account) => {
    const accountInvoices = invoices.filter((inv) => inv._cca_accountid_value === account.cca_accountid);

    const openInvoices = accountInvoices.filter((inv) =>
      OPEN_STATUSES.includes((inv.cca_status ?? "").toLowerCase())
    ).length;

    const daysOverdue = accountInvoices.reduce((max, inv) => Math.max(max, inv.cca_daysoverdue ?? 0), 0);

    return {
      id: account.cca_customercode,
      customer: account.cca_customername,
      initials: account.cca_customerinitial,
      outstandingBalance: account.cca_currentbalance,
      openInvoices,
      daysOverdue,
      riskScore: account.cca_riskscore,
      priority: account.cca_priority,
      collectionStatus: account.cca_status,
      owner: account.cca_approvername,
      ownerInitials: account.cca_aprroverinitial,
      aiReason: account.cca_reason,
    };
  });
}
