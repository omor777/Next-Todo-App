import { TodoList } from "@/components/todos/todo-list";
import type { Todo } from "@/hooks/use-todos";
import { serverFetch } from "@/lib/server-fetch";
import { requireSession } from "@/lib/session";
import { TODO_FILTERS, TodoFilter } from "@/lib/todos/filters";

type DashboardPageProps = {
  searchParams: Promise<{ filter?: string }>;
};

export default async function DashboardPage({
  searchParams,
}: DashboardPageProps) {
  // 1. Auth gate — redirects if no session
  await requireSession();


   const params = await searchParams;
   const requested = params.filter ?? "all";
   const filter: TodoFilter = TODO_FILTERS.includes(requested as TodoFilter)
     ? (requested as TodoFilter)
     : "all";

  // 2. Fetch initial data from the API (same endpoint the client uses)
  const todos = await serverFetch<Todo[]>("/api/todos");

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Your Todos</h1>
      <TodoList initialTodos={todos} filter={filter} />
    </div>
  );
}
