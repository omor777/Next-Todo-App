import { Todo } from "@/hooks/use-todos";
import { serverFetch } from "@/lib/server-fetch";
import { requireSession } from "@/lib/session";
import { isTodoSort } from "@/lib/todo";
import { isTodoFilter } from "@/lib/todos/filters";
import { TodoFilter, TodoSort } from "@/types/todo";
import { TodoList } from "./_components/todo-list";

type DashboardPageProps = {
  searchParams: Promise<{ filter?: string; q?: string; sort?: string }>;
};

export default async function DashboardPage({
  searchParams,
}: DashboardPageProps) {
  await requireSession();

  const params = await searchParams;
  const filter: TodoFilter = isTodoFilter(params.filter)
    ? params.filter
    : "all";
  const searchQuery = (params.q ?? "").slice(0, 200);
  const sort: TodoSort = isTodoSort(params.sort) ? params.sort : "newest";

  const todos = await serverFetch<Todo[]>("/api/todos");

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Your Todos</h1>
      <TodoList
        initialTodos={todos}
        filter={filter}
        searchQuery={searchQuery}
        sort={sort}
      />
    </div>
  );
}
