import type { Todo } from "@/hooks/use-todos";
import { TodoFilter } from "./todos/filters";

export function filterTodos(todos: Todo[], filter: TodoFilter): Todo[] {
  switch (filter) {
    case "active":
      return todos.filter((t) => !t.completed);
    case "completed":
      return todos.filter((t) => t.completed);
    case "all":
    default:
      return todos;
  }
}

// ADD THIS
export function countTodos(todos: Todo[]): Record<TodoFilter, number> {
  let active = 0;
  let completed = 0;

  for (const t of todos) {
    if (t.completed) {
      completed++;
    } else {
      active++;
    }
  }

  return {
    all: todos.length,
  active,
    completed,
  };
}


// ADD THIS
export function searchTodos(todos: Todo[], searchQuery: string): Todo[] {
  const normalizedQuery = searchQuery.trim().toLowerCase()

  if (normalizedQuery.length === 0) {
    return todos
  }

  return todos.filter((todo) =>
    todo.title.toLowerCase().includes(normalizedQuery),
  )
}