import { fetchCcaAccounts } from "../dataversedata/cca_account";
import { fetchCcaInvoices } from "../dataversedata/cca_invoice";
import { fetchCcaPaymentHistories } from "../dataversedata/cca_paymenthistory";

const OPEN_STATUSES = ["overdue", "partial", "pending"];
const OVERDUE_STATUSES = ["overdue", "partial"];

export interface CustomerProfileInvoice {
  iid: string;
  id: string;
  amount: number;
  dueDate: string;
  status: string;
  daysOverdue: number;
}

export interface CustomerProfilePayment {
  date: string;
  amount: number;
  invoice: string;
  // No per-payment "days" source in Dataverse yet — kept static where used.
  days?: number;
}

export interface CustomerProfileCommunication {
  date: string;
  type: string;
  subject: string;
  status: string;
}

export interface CustomerProfile {
  aid: string;
  id: string;
  name: string;
  industry: string;
  email: string;
  phone: string;
  address: string;
  outstandingAmount: number;
  overdueAmount: number;
  totalInvoices: number;
  overdueInvoices: number;
  daysOverdue: number;
  riskScore: number;
  priority: string;
  owner: string;
  creditLimit: number;
  avgPaymentDays: number;
  invoices: CustomerProfileInvoice[];
  paymentHistory: CustomerProfilePayment[];
  communications: CustomerProfileCommunication[];
}

// No Dataverse table for communications yet — kept as static placeholder data.
const MOCK_COMMUNICATIONS: CustomerProfileCommunication[] = [
  { date: "2024-07-18", type: "Email", subject: "Payment Reminder - Overdue Invoices", status: "Sent" },
  { date: "2024-07-10", type: "Call", subject: "Follow-up on outstanding balance", status: "Completed" },
  { date: "2024-06-28", type: "Email", subject: "First Payment Reminder", status: "Sent" },
];

export async function getCustomerProfileByAid(aid: string): Promise<CustomerProfile | null> {
  const [accounts, invoices, payments] = await Promise.all([
    fetchCcaAccounts(),
    fetchCcaInvoices(),
    fetchCcaPaymentHistories(),
  ]);

  const account = accounts.find((a) => a.cca_aid === aid);
  if (!account) {
    console.warn(`[customerProfileController] No account found for cca_aid = ${aid}`);
    return null;
  }

  const accountInvoices = invoices.filter((inv) => inv._cca_accountid_value === account.cca_accountid);
  const invoiceNumberById = new Map(accountInvoices.map((inv) => [inv.cca_invoiceid, inv.cca_invoicenumber]));

  const mappedInvoices: CustomerProfileInvoice[] = accountInvoices.map((inv) => ({
    iid: inv.cca_iid,
    id: inv.cca_invoicenumber,
    amount: inv.cca_invoiceamount,
    dueDate: inv.cca_duedate,
    status: inv.cca_status,
    daysOverdue: inv.cca_daysoverdue,
  }));

  const totalInvoices = accountInvoices.filter((inv) =>
    OPEN_STATUSES.includes((inv.cca_status ?? "").toLowerCase())
  ).length;

  const overdueInvoices = accountInvoices.filter((inv) =>
    OVERDUE_STATUSES.includes((inv.cca_status ?? "").toLowerCase())
  ).length;

  const daysOverdue = accountInvoices.reduce((max, inv) => Math.max(max, inv.cca_daysoverdue ?? 0), 0);
  const avgPaymentDays = daysOverdue + 1;

  const accountPayments = payments.filter((p) => p._cca_accountid_value === account.cca_accountid);

  const paymentHistory: CustomerProfilePayment[] = accountPayments.map((p) => ({
    date: p.cca_paymentdate,
    amount: p.cca_amount,
    invoice: invoiceNumberById.get(p._cca_invoice_value) ?? "Unknown Invoice",
  }));

  const profile: CustomerProfile = {
    aid: account.cca_aid,
    id: account.cca_customercode,
    name: account.cca_customername,
    industry: account.cca_industrytype,
    email: account.cca_email,
    phone: account.cca_phone,
    address: account.cca_address,
    outstandingAmount: account.cca_currentbalance,
    overdueAmount: account.cca_overdueamount,
    totalInvoices,
    overdueInvoices,
    daysOverdue,
    riskScore: account.cca_riskscore,
    priority: account.cca_priority,
    owner: account.cca_approvername,
    creditLimit: account.cca_creditlimit,
    avgPaymentDays,
    invoices: mappedInvoices,
    paymentHistory,
    communications: MOCK_COMMUNICATIONS,
  };

  return profile;
}

// Used by CustomerWorkspace, where the route param matches cca_customercode
// (e.g. "CUST-001"), not the internal cca_aid.
export async function getCustomerProfileByCode(customerCode: string): Promise<CustomerProfile | null> {
  const [accounts, invoices, payments] = await Promise.all([
    fetchCcaAccounts(),
    fetchCcaInvoices(),
    fetchCcaPaymentHistories(),
  ]);

  const account = accounts.find((a) => a.cca_customercode === customerCode);
  if (!account) {
    console.warn(`[customerProfileController] No account found for cca_customercode = ${customerCode}`);
    return null;
  }

  const accountInvoices = invoices.filter((inv) => inv._cca_accountid_value === account.cca_accountid);
  const invoiceNumberById = new Map(accountInvoices.map((inv) => [inv.cca_invoiceid, inv.cca_invoicenumber]));

  const mappedInvoices: CustomerProfileInvoice[] = accountInvoices.map((inv) => ({
    iid: inv.cca_iid,
    id: inv.cca_invoicenumber,
    amount: inv.cca_invoiceamount,
    dueDate: inv.cca_duedate,
    status: inv.cca_status,
    daysOverdue: inv.cca_daysoverdue,
  }));

  const totalInvoices = accountInvoices.filter((inv) =>
    OPEN_STATUSES.includes((inv.cca_status ?? "").toLowerCase())
  ).length;

  const overdueInvoices = accountInvoices.filter((inv) =>
    OVERDUE_STATUSES.includes((inv.cca_status ?? "").toLowerCase())
  ).length;

  const daysOverdue = accountInvoices.reduce((max, inv) => Math.max(max, inv.cca_daysoverdue ?? 0), 0);
  const avgPaymentDays = daysOverdue + 1;

  const accountPayments = payments.filter((p) => p._cca_accountid_value === account.cca_accountid);

  // "days" has no source column yet — kept static so the existing UI column doesn't break.
  const paymentHistory: CustomerProfilePayment[] = accountPayments.map((p) => ({
    date: p.cca_paymentdate,
    amount: p.cca_amount,
    invoice: invoiceNumberById.get(p._cca_invoice_value) ?? "Unknown Invoice",
    days: 0,
  }));

  const profile: CustomerProfile = {
    aid: account.cca_aid,
    id: account.cca_customercode,
    name: account.cca_customername,
    industry: account.cca_industrytype,
    email: account.cca_email,
    phone: account.cca_phone,
    address: account.cca_address,
    outstandingAmount: account.cca_currentbalance,
    overdueAmount: account.cca_overdueamount,
    totalInvoices,
    overdueInvoices,
    daysOverdue,
    riskScore: account.cca_riskscore,
    priority: account.cca_priority,
    owner: account.cca_approvername,
    creditLimit: account.cca_creditlimit,
    avgPaymentDays,
    invoices: mappedInvoices,
    paymentHistory,
    communications: MOCK_COMMUNICATIONS,
  };

  return profile;
}
