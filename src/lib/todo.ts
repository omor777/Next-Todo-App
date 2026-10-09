// src/lib/todo.ts
import type {
  TodoDueFilter,
  TodoFilter,
  TodoPriority,
  TodoSort,
} from "@/types/todo";

export const TODO_FILTERS: readonly TodoFilter[] = [
  "all",
  "active",
  "completed",
];

export const TODO_SORTS: readonly TodoSort[] = [
  "newest",
  "oldest",
  "alphabetical",
  "due-date",
];

export const TODO_PRIORITIES: readonly TodoPriority[] = [
  "LOW",
  "MEDIUM",
  "HIGH",
];

export const TODO_DUE_FILTERS: readonly TodoDueFilter[] = [
  "overdue",
  "today",
  "week",
];

export const PRIORITY_LABELS: Record<TodoPriority, string> = {
  LOW: "Low",
  MEDIUM: "Medium",
  HIGH: "High",
};

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

export function isTodoPriority(value: unknown): value is TodoPriority {
  return (
    typeof value === "string" &&
    (TODO_PRIORITIES as readonly string[]).includes(value)
  );
}

export function isTodoDueFilter(value: unknown): value is TodoDueFilter {
  return (
    typeof value === "string" &&
    (TODO_DUE_FILTERS as readonly string[]).includes(value)
  );
}
