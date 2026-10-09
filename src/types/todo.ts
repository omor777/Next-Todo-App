// src/types/todos.ts

export type TodoFilter = "all" | "active" | "completed";

export type TodoSort = "newest" | "oldest" | "alphabetical" | "due-date";

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

export type TodoStats = {
  totalCount: number;
  completedCount: number;
  activeCount: number;
  completionRate: number;
  currentStreakDays: number;
  weeklyActivity: DailyActivity[];
  priorityBreakdown: PriorityCount[];
};

export type DailyActivity = {
  date: string;
  createdCount: number;
  completedCount: number;
};

export type PriorityCount = {
  priority: TodoPriority;
  count: number;
};