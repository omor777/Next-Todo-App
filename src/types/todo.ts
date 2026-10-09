// src/types/todos.ts

export type TodoFilter = "all" | "active" | "completed";

export type TodoSort = "newest" | "oldest" | "alphabetical" |   "due-date";

export type TodoDueFilter = "overdue" | "today" | "week";

export type TodoPriority = "LOW" | "MEDIUM" | "HIGH";

export type Todo = {
  id: string;
  title: string;
  completed: boolean;
  priority: TodoPriority;
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
};
