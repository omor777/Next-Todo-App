"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";

import { useClearCompletedTodos } from "@/hooks/use-todos";
import { Button } from "@/components/ui/button";
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

type ClearCompletedButtonProps = {
  completedCount: number;
};

export function ClearCompletedButton({
  completedCount,
}: ClearCompletedButtonProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const clearCompletedTodos = useClearCompletedTodos();

  if (completedCount === 0) {
    return null;
  }

  const handleConfirm = () => {
    clearCompletedTodos.mutate(undefined, {
      onSuccess: (result) => {
        setIsDialogOpen(false);
        toast.success(
          `Cleared ${result.deletedCount} completed todo${result.deletedCount === 1 ? "" : "s"}`,
        );
      },
      onError: (err) => {
        setIsDialogOpen(false);
        toast.error(err.message);
      },
    });
  };

  return (
    <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <AlertDialogTrigger
        render={
          <Button
            variant="outline"
            size="sm"
            disabled={clearCompletedTodos.isPending}
          />
        }
      >
        <Trash2 />
        <span>Clear completed ({completedCount})</span>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Clear {completedCount} completed todo
            {completedCount === 1 ? "" : "s"}?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This permanently deletes every completed todo. Active todos are not
            affected. This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            onClick={(event) => {
              event.preventDefault();
              handleConfirm();
            }}
            disabled={clearCompletedTodos.isPending}
          >
            {clearCompletedTodos.isPending ? "Clearing..." : "Clear"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
