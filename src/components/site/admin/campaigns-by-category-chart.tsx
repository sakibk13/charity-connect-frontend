"use client";

import { Cell, Pie, PieChart } from "recharts";

import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import type { Campaign } from "@/lib/types";

const COLORS = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)"];

export function CampaignsByCategoryChart({ campaigns }: { campaigns: Campaign[] }) {
  const counts = new Map<string, number>();
  for (const c of campaigns) {
    counts.set(c.category, (counts.get(c.category) ?? 0) + 1);
  }
  const data = Array.from(counts.entries()).map(([category, count]) => ({ category, count }));

  const chartConfig = Object.fromEntries(
    data.map((d, i) => [d.category, { label: d.category, color: COLORS[i % COLORS.length] }])
  ) satisfies ChartConfig;

  return (
    <div className="flex flex-col items-center gap-4">
      <ChartContainer config={chartConfig} className="mx-auto aspect-square h-56">
        <PieChart>
          <ChartTooltip content={<ChartTooltipContent hideLabel />} />
          <Pie data={data} dataKey="count" nameKey="category" innerRadius={55} outerRadius={80} paddingAngle={2}>
            {data.map((d, i) => (
              <Cell key={d.category} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
        </PieChart>
      </ChartContainer>
      <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-sm">
        {data.map((d, i) => (
          <div key={d.category} className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
            <span className="text-muted-foreground">{d.category}</span>
            <span className="font-medium">{d.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
