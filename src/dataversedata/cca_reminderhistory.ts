import { dvGet, dvPatch } from "../auth/dataverseClient";

export interface CcaReminderHistory {
  cca_reminderhistoryid: string;
  cca_rhid: string;
  _cca_accountid_value: string;
  cca_draftemailsubject: string;
  cca_draftemail: string;
  cca_status: string;
}

// Dataverse's default entity set name for a custom table is the logical name
// pluralized with "s". Update this if the table's actual entity set name differs.
const ENTITY_SET = "cca_reminderhistories";

const COLUMNS: (keyof CcaReminderHistory)[] = [
  "cca_reminderhistoryid",
  "cca_rhid",
  "_cca_accountid_value",
  "cca_draftemailsubject",
  "cca_draftemail",
  "cca_status",
];

export async function fetchCcaReminderHistories(): Promise<CcaReminderHistory[]> {
  const query = `${ENTITY_SET}?$select=${COLUMNS.join(",")}`;
  const result = await dvGet(query);
  return result?.value ?? [];
}

export async function findCcaReminderHistoryByRhid(rhid: string): Promise<CcaReminderHistory | null> {
  const query = `${ENTITY_SET}?$select=${COLUMNS.join(",")}&$filter=cca_rhid eq '${rhid}'`;
  const result = await dvGet(query);
  return result?.value?.[0] ?? null;
}

export async function updateCcaReminderHistoryDraft(
  reminderHistoryId: string,
  updates: { cca_draftemailsubject: string; cca_draftemail: string }
): Promise<void> {
  await dvPatch(`${ENTITY_SET}(${reminderHistoryId})`, updates);
}
