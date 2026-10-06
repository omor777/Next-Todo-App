"use client";

import { useQueryClient } from "@tanstack/react-query";
import { Check, Pencil, Trash2, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import type { Todo } from "@/hooks/use-todos";
import { useDeleteTodo, useUpdateTodo } from "@/hooks/use-todos";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const todoKeys = {
  all: ["todos"] as const,
  list: () => [...todoKeys.all, "list"] as const,
};

export function TodoItem({ todo }: { todo: Todo }) {
  const queryClient = useQueryClient();
  const updateTodo = useUpdateTodo();
  const deleteTodo = useDeleteTodo();

  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState("");
  const [deleting, setDeleting] = useState(false); // ← ADD THIS

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [isEditing]);

  const handleToggle = () => {
    const nextCompleted = !todo.completed;

    queryClient.setQueryData<Todo[]>(todoKeys.list(), (old) =>
      old?.map((t) =>
        t.id === todo.id ? { ...t, completed: nextCompleted } : t,
      ),
    );

    updateTodo.mutate(
      { id: todo.id, completed: nextCompleted },
      {
        onError: (err) => {
          queryClient.invalidateQueries({ queryKey: todoKeys.all });
          toast.error(err.message);
        },
      },
    );
  };

  const handleStartEdit = () => {
    setDraft(todo.title);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleSave = () => {
    const trimmed = draft.trim();

    if (trimmed === todo.title) {
      setIsEditing(false);
      return;
    }

    if (trimmed.length === 0) {
      toast.error("Title cannot be empty");
      return;
    }

    if (trimmed.length > 200) {
      toast.error("Title must be 200 characters or fewer");
      return;
    }

    queryClient.setQueryData<Todo[]>(todoKeys.list(), (old) =>
      old?.map((t) => (t.id === todo.id ? { ...t, title: trimmed } : t)),
    );

    setIsEditing(false);

    updateTodo.mutate(
      { id: todo.id, title: trimmed },
      {
        onSuccess: () => toast.success("Todo updated"),
        onError: (err) => {
          queryClient.invalidateQueries({ queryKey: todoKeys.all });
          toast.error(err.message);
        },
      },
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSave();
    } else if (e.key === "Escape") {
      e.preventDefault();
      handleCancel();
    }
  };

  const handleDelete = () => {
    deleteTodo.mutate(todo.id, {
      onSuccess: () => {
        setDeleting(false);
        toast.success("Todo deleted");
      },
      onError: (err) => {
        setDeleting(false);
        toast.error(err.message);
      },
    });
  };

  return (
    <Card>
      <CardContent className="flex items-center gap-3">
        <Checkbox checked={todo.completed} onCheckedChange={handleToggle} />

        {isEditing ? (
          <>
            <Input
              ref={inputRef}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={handleSave}
              disabled={updateTodo.isPending}
            >
              <Check />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleCancel}>
              <X />
            </Button>
          </>
        ) : (
          <>
            <span className="flex-1">{todo.title}</span>

            {todo.completed && <Badge variant="secondary">Done</Badge>}

            <Button
              variant="ghost"
              size="icon"
              onClick={handleStartEdit}
              disabled={updateTodo.isPending}
            >
              <Pencil />
            </Button>
            <AlertDialog open={deleting} onOpenChange={setDeleting}>
              <AlertDialogTrigger
                render={
                  <Button
                    variant="ghost"
                    size="icon"
                    disabled={deleteTodo.isPending}
                  />
                }
              >
                <Trash2 />
              </AlertDialogTrigger>

              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete this todo?</AlertDialogTitle>
                  <AlertDialogDescription>
                    &ldquo;{todo.title}&rdquo; will be permanently deleted. This
                    action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    variant="destructive"
                    onClick={(e) => {
                      e.preventDefault();
                      handleDelete();
                    }}
                    disabled={deleteTodo.isPending}
                  >
                    {deleteTodo.isPending ? "Deleting..." : "Delete"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </>
        )}
      </CardContent>
    </Card>
  );
}
