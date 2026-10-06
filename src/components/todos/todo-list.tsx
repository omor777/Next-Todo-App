"use client";

import { useTodos, type Todo } from "@/hooks/use-todos";
import { countTodos, filterTodos } from "@/lib/filter-todos";
import { TodoItem } from "./todo-item";
import { CreateTodoForm } from "./create-todo-form";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TodoFilter } from "@/lib/todos/filters";
import { TodoFilters } from "./todo-filters";

type TodoListProps = {
  initialTodos: Todo[];
  filter: TodoFilter;
};

export function TodoList({ initialTodos, filter }: TodoListProps) {
  const {
    data: todos,
    isLoading,
    error,
  } = useTodos({
    initialData: initialTodos,
  });

  const visible = todos ? filterTodos(todos, filter) : [];
  const counts = todos
    ? countTodos(todos)
    : { all: 0, active: 0, completed: 0 };


  return (
    <div className="space-y-4">
      <CreateTodoForm />

      <Card>
        <CardHeader>
          <CardTitle>Your todos</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
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
              <AlertDescription>{emptyMessage(filter)}</AlertDescription>
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

function emptyMessage(filter: TodoFilter): string {
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
