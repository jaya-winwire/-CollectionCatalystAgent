import { fetchCcaPaymentPlans, type CcaPaymentPlan } from "../dataversedata/cca_paymentplan";
import { fetchCcaAccounts } from "../dataversedata/cca_account";

export async function getPaymentPlans(): Promise<CcaPaymentPlan[]> {
  return fetchCcaPaymentPlans();
}

export function countPaymentPlansByAccountId(plans: CcaPaymentPlan[]): Record<string, number> {
  return plans.reduce((counts, plan) => {
    const accountId = plan._cca_accountid_value ?? "unknown";
    counts[accountId] = (counts[accountId] ?? 0) + 1;
    return counts;
  }, {} as Record<string, number>);
}

export async function getPaymentPlanCountsByAccount(): Promise<Record<string, number>> {
  const plans = await fetchCcaPaymentPlans();
  return countPaymentPlansByAccountId(plans);
}

export interface AccountPaymentPlanCount {
  accountId: string;
  accountName: string;
  paymentPlanCount: number;
}

export async function getPaymentPlanCountsByAccountName(): Promise<AccountPaymentPlanCount[]> {
  const [plans, accounts] = await Promise.all([fetchCcaPaymentPlans(), fetchCcaAccounts()]);
  const counts = countPaymentPlansByAccountId(plans);
  const accountsById = new Map(accounts.map((account) => [account.cca_accountid, account]));

  return Object.entries(counts).map(([accountId, paymentPlanCount]) => ({
    accountId,
    accountName: accountsById.get(accountId)?.cca_customername ?? "Unknown Account",
    paymentPlanCount,
  }));
}
