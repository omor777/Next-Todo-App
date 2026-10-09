// src/app/api/todos/bulk-delete/route.ts
import { NextRequest } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { parseBody } from "@/lib/api/parse-body";
import { success, unauthorized, handleApiError } from "@/lib/api/response";

const bulkDeleteSchema = z.object({
  ids: z
    .array(z.string().min(1).max(50))
    .min(1, "At least one todo ID is required")
    .max(500, "Cannot delete more than 500 todos at once"),
});

// POST /api/todos/bulk-delete — delete multiple todos by ID
export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return unauthorized();

    const parsed = await parseBody(request, bulkDeleteSchema);

    
    if (parsed.error) return parsed.error;

    const deleteResult = await prisma.todo.deleteMany({
      where: {
        id: { in: parsed.data.ids },
        userId: session.user.id,
      },
    });

    return success(
      { deletedCount: deleteResult.count },
      `Deleted ${deleteResult.count} todo${deleteResult.count === 1 ? "" : "s"}`,
    );
  } catch (err) {
    return handleApiError(err);
  }
}
