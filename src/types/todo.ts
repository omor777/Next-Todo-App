// src/types/todos.ts
export type Todo = {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
};

export type TodoFilter = "all" | "active" | "completed" ;

export type TodoSort = "newest" | "oldest" | "alphabetical";
