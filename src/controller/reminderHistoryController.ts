import {
  fetchCcaReminderHistories,
  findCcaReminderHistoryByRhid,
  updateCcaReminderHistoryDraft,
  type CcaReminderHistory,
} from "../dataversedata/cca_reminderhistory";
import { fetchCcaAccounts } from "../dataversedata/cca_account";

export async function getReminderHistories(): Promise<CcaReminderHistory[]> {
  return fetchCcaReminderHistories();
}

export function countRemindersByAccountId(reminders: CcaReminderHistory[]): Record<string, number> {
  return reminders.reduce((counts, reminder) => {
    const accountId = reminder._cca_accountid_value ?? "unknown";
    counts[accountId] = (counts[accountId] ?? 0) + 1;
    return counts;
  }, {} as Record<string, number>);
}

export async function getReminderCountsByAccount(): Promise<Record<string, number>> {
  const reminders = await fetchCcaReminderHistories();
  return countRemindersByAccountId(reminders);
}

export interface AccountReminderCount {
  accountId: string;
  accountName: string;
  reminderCount: number;
}

export async function getReminderCountsByAccountName(): Promise<AccountReminderCount[]> {
  const [reminders, accounts] = await Promise.all([fetchCcaReminderHistories(), fetchCcaAccounts()]);
  const counts = countRemindersByAccountId(reminders);
  const accountsById = new Map(accounts.map((account) => [account.cca_accountid, account]));

  return Object.entries(counts).map(([accountId, reminderCount]) => ({
    accountId,
    accountName: accountsById.get(accountId)?.cca_customername ?? "Unknown Account",
    reminderCount,
  }));
}

// Edited from the Email Generator's Edit Draft flow — looks up the record by
// its friendly cca_rhid (e.g. "RH-015") and patches the draft subject/body.
export async function updateReminderDraft(rhid: string, subject: string, body: string): Promise<void> {
  const reminder = await findCcaReminderHistoryByRhid(rhid);
  if (!reminder) {
    throw new Error(`No cca_reminderhistory record found for cca_rhid = ${rhid}`);
  }

  await updateCcaReminderHistoryDraft(reminder.cca_reminderhistoryid, {
    cca_draftemailsubject: subject,
    cca_draftemail: body,
  });
}
