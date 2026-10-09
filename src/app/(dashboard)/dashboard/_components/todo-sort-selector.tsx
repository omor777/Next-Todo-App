"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TodoSort } from "@/types/todo";
import { isTodoSort, TODO_SORTS } from "@/lib/todo";

const SORT_LABELS: Record<TodoSort, string> = {
  newest: "Newest first",
  oldest: "Oldest first",
  alphabetical: "Alphabetical",
};

const DEFAULT_SORT: TodoSort = "newest";

export function TodoSortSelector() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const requestedSort = searchParams.get("sort");
  const currentSort: TodoSort = isTodoSort(requestedSort)
    ? requestedSort
    : DEFAULT_SORT;

  const handleSortChange = (nextSort: TodoSort | null) => {
    if (!isTodoSort(nextSort)) return;

    const nextParams = new URLSearchParams(searchParams.toString());

    if (nextSort === DEFAULT_SORT) {
      nextParams.delete("sort");
    } else {
      nextParams.set("sort", nextSort);
    }

    const nextQueryString = nextParams.toString();
    router.replace(
      nextQueryString ? `${pathname}?${nextQueryString}` : pathname,
      { scroll: false },
    );
  };

  return (
    <Select value={currentSort} onValueChange={handleSortChange}>
      <SelectTrigger>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {TODO_SORTS.map((sortOption) => (
          <SelectItem key={sortOption} value={sortOption}>
            {SORT_LABELS[sortOption]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
