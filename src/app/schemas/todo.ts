import { z } from "zod";

// src/schemas/todo.ts
export const createTodoSchema = z.object({
  title: z.string().min(1).max(200),
  completed: z.boolean().optional(),
});

export const updateTodoSchema = z
  .object({
    title: z.string().min(1).max(200).optional(),
    completed: z.boolean().optional(),
  })
  .refine(
    (data) => Object.keys(data).length > 0,
    "At least one field required",
  );

export const todoIdSchema = z.object({
  id: z.uuid(), // or z.string().min(1)
});
