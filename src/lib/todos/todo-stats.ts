// src/lib/todo-stats.ts
import dayjs from "@/lib/dayjs";
import type {
  DailyActivity,
  PriorityCount,
  Todo,
  TodoPriority,
  TodoStats,
} from "@/types/todo";

const PRIORITY_ORDER: readonly TodoPriority[] = ["HIGH", "MEDIUM", "LOW"];
const WEEK_LENGTH_DAYS = 7;

export function computeStats(todos: Todo[]): TodoStats {
  const completedCount = todos.filter((todo) => todo.completed).length;
  const activeCount = todos.length - completedCount;
  const completionRate =
    todos.length === 0 ? 0 : Math.round((completedCount / todos.length) * 100);

  const currentStreakDays = computeCurrentStreak(todos);
  const weeklyActivity = computeWeeklyActivity(todos);
  const priorityBreakdown = computePriorityBreakdown(todos);

  return {
    totalCount: todos.length,
    completedCount,
    activeCount,
    completionRate,
    currentStreakDays,
    weeklyActivity,
    priorityBreakdown,
  };
}

/**
 * A "streak day" is a day on which at least one todo was completed.
 * We compute it from `updatedAt` on completed todos, since the DB has
 * TODO: do i need any completedAt column in my Todo model?
 * no dedicated `completedAt` column. This is approximate — if a user
 * edits the title of a completed todo today, that todo counts as
 * "completed today". Good enough for a motivational metric.
 */
function computeCurrentStreak(todos: Todo[]): number {
  const completionDates = new Set(
    todos
      .filter((todo) => todo.completed)
      .map((todo) => dayjs(todo.updatedAt).format("YYYY-MM-DD")),
  );

  if (completionDates.size === 0) return 0;

  let streak = 0;
  let cursor = dayjs();

  // If nothing was completed today, start checking from yesterday.
  // The user hasn't broken the streak yet — the day isn't over.
  if (!completionDates.has(cursor.format("YYYY-MM-DD"))) {
    cursor = cursor.subtract(1, "day");
  }

  while (completionDates.has(cursor.format("YYYY-MM-DD"))) {
    streak += 1;
    cursor = cursor.subtract(1, "day");
  }

  return streak;
}

function computeWeeklyActivity(todos: Todo[]): DailyActivity[] {
  const today = dayjs().startOf("day");
  // TODO: Why you have used map data structure here?
  const activityByDate = new Map<string, DailyActivity>();

  // Seed the map with empty entries for the last 7 days
  for (let dayOffset = WEEK_LENGTH_DAYS - 1; dayOffset >= 0; dayOffset--) {
    const dateKey = today.subtract(dayOffset, "day").format("YYYY-MM-DD");
    activityByDate.set(dateKey, {
      date: dateKey,
      createdCount: 0,
      completedCount: 0,
    });
  }

  for (const todo of todos) {
    const createdKey = dayjs(todo.createdAt).format("YYYY-MM-DD");
    const createdEntry = activityByDate.get(createdKey);
    if (createdEntry) createdEntry.createdCount += 1;

    if (todo.completed) {
      const completedKey = dayjs(todo.updatedAt).format("YYYY-MM-DD");
      const completedEntry = activityByDate.get(completedKey);
      if (completedEntry) completedEntry.completedCount += 1;
    }
  }

  return Array.from(activityByDate.values());
}

function computePriorityBreakdown(todos: Todo[]): PriorityCount[] {
  const counts: Record<TodoPriority, number> = {
    HIGH: 0,
    MEDIUM: 0,
    LOW: 0,
  };

  for (const todo of todos) {
    if (!todo.completed) {
      counts[todo.priority] += 1;
    }
  }

  return PRIORITY_ORDER.map((priority) => ({
    priority,
    count: counts[priority],
  }));
}
