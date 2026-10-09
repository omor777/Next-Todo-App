import dayjs from "@/lib/dayjs";
import { Badge } from "@/components/ui/badge";

type DueDateIndicatorProps = {
  dueDate: string;
};
// TODO: Understand later
export function DueDateIndicator({ dueDate }: DueDateIndicatorProps) {
  const due = dayjs(dueDate);
  const now = dayjs();
  const isOverdue = due.isBefore(now.startOf("day")) && !due.isSame(now, "day");
  const isToday = due.isSame(now, "day");
  const isTomorrow = due.isSame(now.add(1, "day"), "day");

  if (isOverdue) {
    return <Badge variant="destructive">Overdue by {due.fromNow(true)}</Badge>;
  }

  if (isToday) {
    return <Badge variant="secondary">Due today</Badge>;
  }

  if (isTomorrow) {
    return <Badge variant="outline">Due tomorrow</Badge>;
  }

  return <Badge variant="outline">{due.format("MMM D, YYYY")}</Badge>;
}
