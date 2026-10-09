// src/schemas/todo.ts
import { z } from "zod";

export const createTodoSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .max(200, "Title must be 200 characters or fewer"),
  completed: z.boolean().optional().default(false),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]).optional().default("MEDIUM"),
  dueDate: z
    .string()
    .datetime({ message: "Due date must be a valid ISO date string" })
    .nullable()
    .optional(),
});

export const updateTodoSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(1, "Title cannot be empty")
      .max(200, "Title must be 200 characters or fewer")
      .optional(),
    completed: z.boolean().optional(),
    priority: z.enum(["LOW", "MEDIUM", "HIGH"]).optional(),
    dueDate: z
      .string()
      .datetime({ message: "Due date must be a valid ISO date string" })
      .nullable()
      .optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided",
  });

export const todoIdSchema = z
  .string()
  .min(1, "Todo ID is required")
  .max(50, "Invalid Todo ID");

export type CreateTodoInput = z.infer<typeof createTodoSchema>;
export type UpdateTodoInput = z.infer<typeof updateTodoSchema>;
