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

    case "due-date":
      return copy.sort((a, b) => {
        // Todos without a due date sort to the bottom
        if (!a.dueDate && !b.dueDate) return 0;
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return dayjs(a.dueDate).diff(dayjs(b.dueDate));
      });

    case "newest":
    default:
      return copy.sort((a, b) => dayjs(b.createdAt).diff(dayjs(a.createdAt)));
  }
}
