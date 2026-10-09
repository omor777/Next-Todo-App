"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PRIORITY_LABELS, TODO_PRIORITIES, isTodoPriority } from "@/lib/todo";

const ALL_VALUE = "all";

export function PriorityFilter() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const requestedPriority = searchParams.get("priority");
  const currentValue = isTodoPriority(requestedPriority)
    ? requestedPriority
    : ALL_VALUE;

  const handleChange = (nextValue: string | null) => {
    const nextParams = new URLSearchParams(searchParams.toString());

    if (nextValue === ALL_VALUE) {
      nextParams.delete("priority");
    } else if (isTodoPriority(nextValue)) {
      nextParams.set("priority", nextValue);
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
        <SelectItem value={ALL_VALUE}>Any priority</SelectItem>
        {TODO_PRIORITIES.map((priorityOption) => (
          <SelectItem key={priorityOption} value={priorityOption}>
            {PRIORITY_LABELS[priorityOption]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
