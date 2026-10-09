import type { TodoPriority } from "@/types/todo";
import { PRIORITY_LABELS } from "@/lib/todo";
import { Badge } from "@/components/ui/badge";

const PRIORITY_VARIANTS: Record<
  TodoPriority,
  "default" | "secondary" | "destructive" | "outline"
> = {
  LOW: "outline",
  MEDIUM: "secondary",
  HIGH: "destructive",
};

type PriorityBadgeProps = {
  priority: TodoPriority;
};

export function PriorityBadge({ priority }: PriorityBadgeProps) {
  return (
    <Badge variant={PRIORITY_VARIANTS[priority]}>
      {PRIORITY_LABELS[priority]}
    </Badge>
  );
}
