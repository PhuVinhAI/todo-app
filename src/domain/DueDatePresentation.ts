import { addDaysToDateString } from "../filters/dateUtils";

export function formatDueLabel(dueDate: string, referenceToday: string): string {
  if (dueDate === referenceToday) {
    return "Hôm nay";
  }

  if (dueDate === addDaysToDateString(referenceToday, 1)) {
    return "Ngày mai";
  }

  const [year, month, day] = dueDate.split("-");
  return `${day}/${month}/${year}`;
}
