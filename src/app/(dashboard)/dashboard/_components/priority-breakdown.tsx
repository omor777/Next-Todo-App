"use client";

import { Cell, Pie, PieChart } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { PRIORITY_LABELS } from "@/lib/todo";
import type { PriorityCount } from "@/types/todo";

const chartConfig = {
  count: {
    label: "Active todos",
  },
  HIGH: {
    label: PRIORITY_LABELS.HIGH,
    color: "var(--chart-5)",
  },
  MEDIUM: {
    label: PRIORITY_LABELS.MEDIUM,
    color: "var(--chart-4)",
  },
  LOW: {
    label: PRIORITY_LABELS.LOW,
    color: "var(--chart-3)",
  },
} satisfies ChartConfig;

type PriorityBreakdownProps = {
  breakdown: PriorityCount[];
};

export function PriorityBreakdown({ breakdown }: PriorityBreakdownProps) {
  const totalActiveCount = breakdown.reduce(
    (sum, entry) => sum + entry.count,
    0,
  );

  if (totalActiveCount === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Active by priority</CardTitle>
          <CardDescription>
            How your remaining work is distributed.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            No active todos. Nice work.
          </p>
        </CardContent>
      </Card>
    );
  }

  // Recharts renders slices proportionally; zero-count entries
  // would produce invisible slices cluttering the legend, so filter them out.
  const visibleBreakdown = breakdown.filter((entry) => entry.count > 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Active by priority</CardTitle>
        <CardDescription>
          {totalActiveCount} active todo{totalActiveCount === 1 ? "" : "s"} by
          priority.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="mx-auto min-h-60">
          <PieChart>
            <ChartTooltip
              content={<ChartTooltipContent nameKey="priority" hideLabel />}
            />
            <Pie
              data={visibleBreakdown}
              dataKey="count"
              nameKey="priority"
              innerRadius={60}
              strokeWidth={4}
            >
              {visibleBreakdown.map((entry) => (
                <Cell
                  key={entry.priority}
                  fill={`var(--color-${entry.priority})`}
                />
              ))}
            </Pie>
            <ChartLegend content={<ChartLegendContent nameKey="priority" />} />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
