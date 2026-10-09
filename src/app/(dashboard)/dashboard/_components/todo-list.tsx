"use client";

import { ClearCompletedButton } from "@/components/todos/clear-completed-button";
import { CreateTodoForm } from "@/components/todos/create-todo-form";
import { TodoFilters } from "@/components/todos/todo-filters";
import { TodoSearch } from "@/components/todos/todo-search";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useTodos, type Todo } from "@/hooks/use-todos";
import { countTodos, filterByDueDate, filterByPriority, filterTodos, searchTodos } from "@/lib/filter-todos";
import { sortTodos } from "@/lib/todos/sort-todos";
import { TodoDueFilter, TodoFilter, TodoPriority, TodoSort } from "@/types/todo";
import { CheckSquare } from "lucide-react";
import { useState } from "react";
import { TodoSortSelector } from "./todo-sort-selector";
import { SelectionToolbar } from "./selection-toolbar";
import { TodoItem } from "./todo-item";
import { PriorityFilter } from "./priority-filter";
import { DueDateFilter } from "./due-date-filter";

type TodoListProps = {
  initialTodos: Todo[];
  filter: TodoFilter;
  searchQuery: string;
  sort: TodoSort;
  priorityFilter: TodoPriority | null;
  dueFilter: TodoDueFilter | null;
};

export function TodoList({
  initialTodos,
  filter,
  searchQuery,
  sort,
  priorityFilter,
  dueFilter,
}: TodoListProps) {
  const {
    data: todos,
    isLoading,
    error,
  } = useTodos({
    initialData: initialTodos,
  });

  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedTodoIds, setSelectedTodoIds] = useState<Set<string>>(
    new Set(),
  );

 const counts = todos ? countTodos(todos) : { all: 0, active: 0, completed: 0 };

 
 const filteredByStatus = todos ? filterTodos(todos, filter) : [];
 const filteredByPriority = filterByPriority(filteredByStatus, priorityFilter);
 const filteredByDue = filterByDueDate(filteredByPriority, dueFilter);
 const searchedTodos = searchTodos(filteredByDue, searchQuery);
 const visible = sortTodos(searchedTodos, sort);

  const handleSelectionChange = (todoId: string, nextSelected: boolean) => {
    setSelectedTodoIds((previousIds) => {
      const nextIds = new Set(previousIds);
      if (nextSelected) nextIds.add(todoId);
      else nextIds.delete(todoId);
      return nextIds;
    });
  };

  const handleCancelSelection = () => {
    setIsSelectionMode(false);
    setSelectedTodoIds(new Set());
  };

  const handleDeleteSuccess = () => {
    setIsSelectionMode(false);
    setSelectedTodoIds(new Set());
  };

  return (
    <div className="space-y-4">
      <CreateTodoForm />

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-2">
            <CardTitle>Your todos</CardTitle>
            <div className="flex items-center gap-2">
              {!isSelectionMode && visible.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsSelectionMode(true)}
                >
                  <CheckSquare />
                  <span>Select</span>
                </Button>
              )}
              <ClearCompletedButton completedCount={counts.completed} />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <TodoSearch />
          <TodoFilters counts={counts} />

          <div className="ml-auto flex items-center gap-2">
            <PriorityFilter />
            <DueDateFilter />
            <TodoSortSelector />
          </div>

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
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  isSelectionMode={isSelectionMode}
                  isSelected={selectedTodoIds.has(todo.id)}
                  onSelectionChange={handleSelectionChange}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      <SelectionToolbar
        selectedCount={selectedTodoIds.size}
        selectedIds={Array.from(selectedTodoIds)}
        onCancelSelection={handleCancelSelection}
        onDeleteSuccess={handleDeleteSuccess}
      />
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
