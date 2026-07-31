import { fetchCcaPaymentHistories, type CcaPaymentHistory } from "../dataversedata/cca_paymenthistory";
import { fetchCcaAccounts } from "../dataversedata/cca_account";

export async function getPaymentHistories(): Promise<CcaPaymentHistory[]> {
  return fetchCcaPaymentHistories();
}

export function countPaymentsByAccountId(payments: CcaPaymentHistory[]): Record<string, number> {
  return payments.reduce((counts, payment) => {
    const accountId = payment._cca_accountid_value ?? "unknown";
    counts[accountId] = (counts[accountId] ?? 0) + 1;
    return counts;
  }, {} as Record<string, number>);
}

export async function getPaymentCountsByAccount(): Promise<Record<string, number>> {
  const payments = await fetchCcaPaymentHistories();
  return countPaymentsByAccountId(payments);
}

export interface AccountPaymentCount {
  accountId: string;
  accountName: string;
  paymentCount: number;
}

export async function getPaymentCountsByAccountName(): Promise<AccountPaymentCount[]> {
  const [payments, accounts] = await Promise.all([fetchCcaPaymentHistories(), fetchCcaAccounts()]);
  const counts = countPaymentsByAccountId(payments);
  const accountsById = new Map(accounts.map((account) => [account.cca_accountid, account]));

  return Object.entries(counts).map(([accountId, paymentCount]) => ({
    accountId,
    accountName: accountsById.get(accountId)?.cca_customername ?? "Unknown Account",
    paymentCount,
  }));
}
