// src/app/api/todos/stats/route.ts
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { success, unauthorized, handleApiError } from "@/lib/api/response";
import { computeStats } from "@/lib/todos/todo-stats";

// GET /api/todos/stats — aggregate stats for the current user
export async function GET() {
  try {
    const session = await getSession();
    if (!session) return unauthorized();

    const todos = await prisma.todo.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    });

    const stats = computeStats(
      todos.map((todo) => ({
        ...todo,
        dueDate: todo.dueDate ? todo.dueDate.toISOString() : null,
        createdAt: todo.createdAt.toISOString(),
        updatedAt: todo.updatedAt.toISOString(),
      })),
    );

    return success(stats);
  } catch (err) {
    return handleApiError(err);
  }
}
