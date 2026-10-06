"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";



import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldError } from "@/components/ui/field";
import { useCreateTodo } from "@/hooks/use-todos";

const createTodoSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required.")
    .max(200, "Title must be 200 characters or fewer."),
});

type CreateTodoValues = z.infer<typeof createTodoSchema>;

export function CreateTodoForm() {
  const createTodo = useCreateTodo();

  const { control, handleSubmit, reset } = useForm<CreateTodoValues>({
    resolver: zodResolver(createTodoSchema),
    defaultValues: { title: "" },
  });

  const onSubmit = (data: CreateTodoValues) => {
    createTodo.mutate(
      { title: data.title },
      {
        onSuccess: () => {
          reset();
          toast.success("Todo added");
        },
        onError: (err) => toast.error(err.message),
      },
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Add a todo</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          id="create-todo-form"
          onSubmit={handleSubmit(onSubmit)}
          className="flex items-start gap-2"
        >
          <Controller
            name="title"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className="flex-1">
                <Input
                  {...field}
                  placeholder="What needs to be done?"
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Button type="submit" disabled={createTodo.isPending}>
            {createTodo.isPending ? "Adding..." : "Add"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
