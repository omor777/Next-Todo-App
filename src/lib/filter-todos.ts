// src/lib/filter-todos.ts
import dayjs from "@/lib/dayjs";
import type {
  Todo,
  TodoDueFilter,
  TodoFilter,
  TodoPriority,
} from "@/types/todo";

export function filterTodos(todos: Todo[], filter: TodoFilter): Todo[] {
  switch (filter) {
    case "active":
      return todos.filter((todo) => !todo.completed);
    case "completed":
      return todos.filter((todo) => todo.completed);
    case "all":
    default:
      return todos;
  }
}

export function countTodos(todos: Todo[]): Record<TodoFilter, number> {
  let active = 0;
  let completed = 0;

  for (const todo of todos) {
    if (todo.completed) completed++;
    else active++;
  }

  return {
    all: todos.length,
    active,
    completed,
  };
}

export function searchTodos(todos: Todo[], searchQuery: string): Todo[] {
  const normalizedQuery = searchQuery.trim().toLowerCase();
  if (normalizedQuery.length === 0) return todos;

  return todos.filter((todo) =>
    todo.title.toLowerCase().includes(normalizedQuery),
  );
}

export function filterByPriority(
  todos: Todo[],
  priority: TodoPriority | null,
): Todo[] {
  if (!priority) return todos;
  return todos.filter((todo) => todo.priority === priority);
}

//TODO: I will understand this function later
export function filterByDueDate(
  todos: Todo[],
  dueFilter: TodoDueFilter | null,
): Todo[] {
  if (!dueFilter) return todos;

  const now = dayjs();
  const startOfToday = now.startOf("day");
  const endOfToday = now.endOf("day");
  const endOfWeek = now.add(7, "day").endOf("day");

  return todos.filter((todo) => {
    if (!todo.dueDate) return false;
    const due = dayjs(todo.dueDate);

    switch (dueFilter) {
      case "overdue":
        return due.isBefore(startOfToday);
      case "today":
        return due.isAfter(startOfToday) && due.isBefore(endOfToday);
      case "week":
        return due.isAfter(endOfToday) && due.isBefore(endOfWeek);
    }
  });
}
