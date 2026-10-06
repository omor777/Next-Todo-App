import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/session";

import {
  success,
  created,
  unauthorized,
  validationError,
  handleApiError,
  error,
} from "@/lib/api/response";
import { createTodoSchema } from "@/app/schemas/todo";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) return unauthorized();

    const todos = await prisma.todo.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    });

    return success(todos);
  } catch (err) {
    console.error("[GET_TODOS_ERROR]", err);
    return handleApiError(err);
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return unauthorized();

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return error("Invalid JSON body", 400, "INVALID_JSON");
    }

    const parsed = createTodoSchema.safeParse(body);
    if (!parsed.success) return validationError(parsed.error);

    const todo = await prisma.todo.create({
      data: {
        ...parsed.data,
        userId: session.user.id,
      },
    });

    return created(todo, "Todo created successfully");
  } catch (err) {
    console.error("[POST_TODO_ERROR]", err);
    return handleApiError(err);
  }
}
