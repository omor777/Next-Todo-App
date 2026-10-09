// src/lib/todos.ts

import { TodoFilter, TodoSort } from "@/types/todo";

export const TODO_FILTERS: readonly TodoFilter[] = [
  "all",
  "active",
  "completed",
];
export const TODO_SORTS: readonly TodoSort[] = [
  "newest",
  "oldest",
  "alphabetical",
];

export function isTodoFilter(value: unknown): value is TodoFilter {
  return (
    typeof value === "string" &&
    (TODO_FILTERS as readonly string[]).includes(value)
  );
}

export function isTodoSort(value: unknown): value is TodoSort {
  return (
    typeof value === "string" &&
    (TODO_SORTS as readonly string[]).includes(value)
  );
}
