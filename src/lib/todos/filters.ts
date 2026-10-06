// src/lib/todos/filters.ts
export const TODO_FILTERS = ["all", "active", "completed"] as const;

export type TodoFilter = (typeof TODO_FILTERS)[number];

export function isTodoFilter(value: unknown): value is TodoFilter {
  return (
    typeof value === "string" &&
    (TODO_FILTERS as readonly string[]).includes(value)
  );
}
