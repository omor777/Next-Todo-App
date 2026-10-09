// src/lib/sort-todos.ts
import dayjs from "@/lib/dayjs";
import type { Todo, TodoSort } from "@/types/todo";

export function sortTodos(todos: Todo[], sort: TodoSort): Todo[] {
  const copy = [...todos];

  switch (sort) {
    case "oldest":
      return copy.sort((a, b) => dayjs(a.createdAt).diff(dayjs(b.createdAt)));
    case "alphabetical":
      return copy.sort((a, b) => a.title.localeCompare(b.title));
    case "newest":
    default:
      return copy.sort((a, b) => dayjs(b.createdAt).diff(dayjs(a.createdAt)));
  }
}
