"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TODO_DUE_FILTERS, isTodoDueFilter } from "@/lib/todo";
import type { TodoDueFilter } from "@/types/todo";

const ALL_VALUE = "all";

const DUE_FILTER_LABELS: Record<TodoDueFilter, string> = {
  overdue: "Overdue",
  today: "Due today",
  week: "Due this week",
};

export function DueDateFilter() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const requestedDue = searchParams.get("due");
  const currentValue = isTodoDueFilter(requestedDue) ? requestedDue : ALL_VALUE;

  const handleChange = (nextValue: string | null) => {
    const nextParams = new URLSearchParams(searchParams.toString());

    if (nextValue === ALL_VALUE) {
      nextParams.delete("due");
    } else if (isTodoDueFilter(nextValue)) {
      nextParams.set("due", nextValue);
    }

    const nextQueryString = nextParams.toString();
    router.replace(
      nextQueryString ? `${pathname}?${nextQueryString}` : pathname,
      { scroll: false },
    );
  };

  return (
    <Select value={currentValue} onValueChange={handleChange}>
      <SelectTrigger>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={ALL_VALUE}>Any due date</SelectItem>
        {TODO_DUE_FILTERS.map((dueOption) => (
          <SelectItem key={dueOption} value={dueOption}>
            {DUE_FILTER_LABELS[dueOption]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
