// src/app/api/todos/completed/route.ts
import { handleApiError, success, unauthorized } from "@/lib/api/response";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/session";

// DELETE /api/todos/completed — remove every completed todo for the current user
export async function DELETE() {
  try {
    const session = await getSession();
    if (!session) return unauthorized();

    const deleteResult = await prisma.todo.deleteMany({
      where: {
        userId: session.user.id,
        completed: true,
      },
    });

    return success(
      { deletedCount: deleteResult.count },
      `Deleted ${deleteResult.count} completed todo${deleteResult.count === 1 ? "" : "s"}`,
    );
  } catch (err) {
    
    return handleApiError(err);
  }
}
