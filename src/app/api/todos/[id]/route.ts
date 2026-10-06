import { updateTodoSchema } from "@/app/schemas/todo";
import {
  error,
  forbidden,
  handleApiError,
  notFound,
  success,
  unauthorized,
  validationError,
} from "@/lib/api/response";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { NextRequest } from "next/server";

export async function GET(
  _request: NextRequest,
  ctx: RouteContext<"/api/todos/[id]">,
) {
  try {
    const session = await getSession();
    if (!session) return unauthorized();

    const { id } = await ctx.params;

    const todo = await prisma.todo.findUnique({ where: { id } });
    if (!todo) return notFound("Todo not found");
    if (todo.userId !== session.user.id) return forbidden();

    return success(todo);
  } catch (err) {
    console.error("[GET_TODO_ERROR]", err);

    return handleApiError(err);
  }
}

export async function PATCH(
  request: NextRequest,
  ctx: RouteContext<"/api/todos/[id]">,
) {
  try {
    const session = await getSession();
    if (!session) return unauthorized();

    const { id } = await ctx.params;

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return error("Invalid JSON body", 400, "INVALID_JSON");
    }

    const parsed = updateTodoSchema.safeParse(body);
    if (!parsed.success) return validationError(parsed.error);

    // Ownership check
    const existing = await prisma.todo.findUnique({
      where: { id },
      select: { userId: true },
    });
    if (!existing) return notFound("Todo not found");
    if (existing.userId !== session.user.id) return forbidden();

    const todo = await prisma.todo.update({
      where: { id },
      data: parsed.data,
    });

    return success(todo, "Todo updated successfully");
  } catch (err) {
    console.error("[PATCH_TODO_ERROR]", err);
    return handleApiError(err);
  }
}

export async function DELETE(
  _request: NextRequest,
  ctx: RouteContext<"/api/todos/[id]">,
) {
  try {
    const session = await getSession();
    if (!session) return unauthorized();

    const { id } = await ctx.params;

    const existing = await prisma.todo.findUnique({
      where: { id },
      select: { userId: true },
    });
    if (!existing) return notFound("Todo not found");
    if (existing.userId !== session.user.id) return forbidden();

    await prisma.todo.delete({ where: { id } });

    return success({ id }, "Todo deleted successfully");
  } catch (err) {
    console.error("[DELETE_TODO_ERROR]", err);
    return handleApiError(err);
  }
}
