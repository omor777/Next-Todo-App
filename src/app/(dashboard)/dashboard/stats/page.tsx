import { CheckCircle2, Flame, ListChecks, TrendingUp } from "lucide-react";

import { requireSession } from "@/lib/session";
import { serverFetch } from "@/lib/server-fetch";
import type { TodoStats } from "@/types/todo";
import { formatCompletionRate, formatStreak } from "@/lib/format-stats";
import { StatCard } from "../_components/stat-card";
import { WeeklyActivityChart } from "../_components/weekly-activity-chart";
import { PriorityBreakdown } from "../_components/priority-breakdown";

// TODO: What is weekly activity can you explain? why I need this?


export default async function StatsPage() {
  await requireSession();

  const stats = await serverFetch<TodoStats>("/api/todos/stats");

console.log(stats);
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Stats</h1>
        <p className="text-sm text-muted-foreground">
          Your productivity at a glance.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <StatCard
          title="Total todos"
          value={String(stats.totalCount)}
          description={`${stats.activeCount} active, ${stats.completedCount} completed`}
          icon={<ListChecks />}
        />
        <StatCard
          title="Completion rate"
          value={formatCompletionRate(stats.completionRate)}
          description="Across all todos"
          icon={<TrendingUp />}
        />
        <StatCard
          title="Current streak"
          value={formatStreak(stats.currentStreakDays)}
          description="Consecutive days with a completion"
          icon={<Flame />}
        />
        <StatCard
          title="Active todos"
          value={String(stats.activeCount)}
          description="Still on your plate"
          icon={<CheckCircle2 />}
        />
      </div>

      <WeeklyActivityChart activity={stats.weeklyActivity} />
      <PriorityBreakdown breakdown={stats.priorityBreakdown} />
    </div>
  );
}
