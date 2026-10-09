"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Trash2, X } from "lucide-react";

import { useBulkDeleteTodos } from "@/hooks/use-todos";
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

type SelectionToolbarProps = {
  selectedCount: number;
  selectedIds: string[];
  onCancelSelection: () => void;
  onDeleteSuccess: () => void;
};

export function SelectionToolbar({
  selectedCount,
  selectedIds,
  onCancelSelection,
  onDeleteSuccess,
}: SelectionToolbarProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const bulkDeleteTodos = useBulkDeleteTodos();

  if (selectedCount === 0) {
    return null;
  }

  const handleConfirmDelete = () => {
    bulkDeleteTodos.mutate(selectedIds, {
      onSuccess: (result) => {
        setIsDialogOpen(false);
        onDeleteSuccess();
        toast.success(
          `Deleted ${result.deletedCount} todo${result.deletedCount === 1 ? "" : "s"}`,
        );
      },
      onError: (err) => {
        setIsDialogOpen(false);
        toast.error(err.message);
      },
    });
  };

  return (
    <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2">
      <div className="flex items-center gap-2 rounded-lg border bg-background p-2 shadow-lg">
        <span className="px-2 text-sm font-medium">
          {selectedCount} selected
        </span>

        <Button variant="ghost" size="sm" onClick={onCancelSelection}>
          <X />
          <span>Cancel</span>
        </Button>

        <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <AlertDialogTrigger
            render={
              <Button
                variant="destructive"
                size="sm"
                disabled={bulkDeleteTodos.isPending}
              />
            }
          >
            <Trash2 />
            <span>Delete</span>
          </AlertDialogTrigger>

          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Delete {selectedCount} todo{selectedCount === 1 ? "" : "s"}?
              </AlertDialogTitle>
              <AlertDialogDescription>
                This permanently deletes the selected todo
                {selectedCount === 1 ? "" : "s"}. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                variant="destructive"
                onClick={(event) => {
                  event.preventDefault();
                  handleConfirmDelete();
                }}
                disabled={bulkDeleteTodos.isPending}
              >
                {bulkDeleteTodos.isPending ? "Deleting..." : "Delete"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
