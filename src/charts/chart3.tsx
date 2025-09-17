"use client"
import { RadialBar, RadialBarChart } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

export const description = "A radial chart"

const chartData = [
  { platform: "swiggy", fillrate: 62, fill: "var(--color-swiggy)" },
  { platform: "zomato", fillrate: 56, fill: "var(--color-zomato)" },
  { platform: "blinkit", fillrate: 48, fill: "var(--color-blinkit)" },
  { platform: "zepto", fillrate: 42, fill: "var(--color-zepto)" },
  { platform: "dunzo", fillrate: 36, fill: "var(--color-dunzo)" },
]

const chartConfig = {
  visitors: {
    label: "Fill Rates",
  },
  swiggy: {
    label: "Swiggy",
    color: "var(--chart-1)",
  },
  zomato: {
    label: "Zomato",
    color: "var(--chart-2)",
  },
  blinkit: {
    label: "Blinkit",
    color: "var(--chart-3)",
  },
  zepto: {
    label: "Zepto",
    color: "var(--chart-4)",
  },
  dunzo: {
    label: "Dunzo",
    color: "var(--chart-5)",
  },
} satisfies ChartConfig

export function ChartRadialSimple() {
  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Fill Rate</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <RadialBarChart data={chartData} innerRadius={30} outerRadius={110}>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel nameKey="platform" />}
            />
            <RadialBar dataKey="fillrate" background />
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
