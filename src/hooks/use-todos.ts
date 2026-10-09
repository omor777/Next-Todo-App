"use client";

import { api } from "@/lib/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export type Todo = {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
};

const todoKeys = {
  all: ["todos"] as const,
  list: () => [...todoKeys.all, "list"] as const,
};

async function fetchTodos(): Promise<Todo[]> {
  return api.get<Todo[]>("/api/todos");
}

async function createTodo(input: { title: string }): Promise<Todo> {
  return api.post<Todo>("/api/todos", input);
}

async function updateTodo(input: {
  id: string;
  completed?: boolean;
  title?: string;
}): Promise<Todo> {
  const { id, ...body } = input;
  return api.patch<Todo>(`/api/todos/${id}`, body);
}

async function deleteTodo(id: string): Promise<{ id: string }> {
  return api.delete<{ id: string }>(`/api/todos/${id}`);
}

export function useTodos(options?: { initialData?: Todo[] }) {
  return useQuery({
    queryKey: todoKeys.list(),
    queryFn: fetchTodos,
    initialData: options?.initialData,
    staleTime: options?.initialData ? 30_000 : 0,
  });
}

export function useCreateTodo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: todoKeys.all });
    },
  });
}

export function useUpdateTodo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: todoKeys.all });
    },
  });
}

export function useDeleteTodo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: todoKeys.all });
    },
  });
}

async function clearCompletedTodos(): Promise<{ deletedCount: number }> {
  return api.delete<{ deletedCount: number }>("/api/todos/completed");
}

// ADD THIS HOOK
export function useClearCompletedTodos() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: clearCompletedTodos,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: todoKeys.all });
    },
  });
}

async function bulkDeleteTodos(
  todoIds: string[],
): Promise<{ deletedCount: number }> {
  return api.post<{ deletedCount: number }>("/api/todos/bulk-delete", {
    ids: todoIds,
  });
}

export function useBulkDeleteTodos() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: bulkDeleteTodos,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: todoKeys.all });
    },
  });
}