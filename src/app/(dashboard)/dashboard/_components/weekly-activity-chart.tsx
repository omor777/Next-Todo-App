"use client";

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import type { DailyActivity } from "@/types/todo";
import { formatDayLabel } from "@/lib/format-stats";
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

const chartConfig = {
  createdCount: {
    label: "Created",
    color: "var(--chart-1)",
  },
  completedCount: {
    label: "Completed",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

type WeeklyActivityChartProps = {
  activity: DailyActivity[];
};

export function WeeklyActivityChart({ activity }: WeeklyActivityChartProps) {
  // Recharts needs a `label` field for the X axis to display
  // the weekday name instead of the raw ISO date.
  const chartData = activity.map((day) => ({
    ...day,
    label: formatDayLabel(day.date),
  }));


  console.log(chartData);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Last 7 days</CardTitle>
        <CardDescription>Todos created and completed per day.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-60 w-full">
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="label"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar
              dataKey="createdCount"
              fill="var(--color-createdCount)"
              radius={4}
            />
            <Bar
              dataKey="completedCount"
              fill="var(--color-completedCount)"
              radius={4}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
