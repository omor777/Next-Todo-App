"use client";

import { useTodos, type Todo } from "@/hooks/use-todos";
import { countTodos, filterTodos, searchTodos } from "@/lib/filter-todos";
import { TodoItem } from "./todo-item";
import { CreateTodoForm } from "./create-todo-form";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TodoFilter } from "@/lib/todos/filters";
import { TodoFilters } from "./todo-filters";
import { TodoSearch } from "./todo-search";

type TodoListProps = {
  initialTodos: Todo[]
  filter: TodoFilter
  searchQuery: string
}

export function TodoList({ initialTodos, filter, searchQuery }: TodoListProps) {
  const {
    data: todos,
    isLoading,
    error,
  } = useTodos({
    initialData: initialTodos,
  });

 const counts = todos ? countTodos(todos) : { all: 0, active: 0, completed: 0 };
 const filteredByStatus = todos ? filterTodos(todos, filter) : [];
 const visible = searchTodos(filteredByStatus, searchQuery);


  return (
    <div className="space-y-4">
      <CreateTodoForm />

      <Card>
        <CardHeader>
          <CardTitle>Your todos</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <TodoSearch />
          <TodoFilters counts={counts} />

          {isLoading && (
            <div className="space-y-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-14 w-full" />
              ))}
            </div>
          )}

          {error && (
            <Alert variant="destructive">
              <AlertTitle>Failed to load todos</AlertTitle>
              <AlertDescription>{error.message}</AlertDescription>
            </Alert>
          )}

          {!isLoading && !error && visible.length === 0 && (
            <Alert>
              <AlertTitle>Nothing here</AlertTitle>
              <AlertDescription>
                {emptyMessage(filter, searchQuery)}
              </AlertDescription>
            </Alert>
          )}

          {visible.length > 0 && (
            <div className="space-y-2">
              {visible.map((todo) => (
                <TodoItem key={todo.id} todo={todo} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function emptyMessage(filter: TodoFilter, searchQuery: string): string {
  if (searchQuery.trim().length > 0) {
    return `No todos match "${searchQuery}".`;
  }

  switch (filter) {
    case "active":
      return "No active todos. Nice work.";
    case "completed":
      return "No completed todos yet.";
    case "all":
    default:
      return "Add one above to get started.";
  }
}
