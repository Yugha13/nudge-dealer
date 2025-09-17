"use client"

import { TrendingUp } from "lucide-react"
import { Pie, PieChart } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

export const description = "A donut chart"

const chartData = [
  { platform: "swiggy", grns: 275, fill: "var(--color-swiggy)" },
  { platform: "zomato", grns: 200, fill: "var(--color-zomato)" },
  { platform: "blinkit", grns: 187, fill: "var(--color-blinkit)" },
  { platform: "zepto", grns: 173, fill: "var(--color-zepto)" },
  { platform: "dunzo", grns: 90, fill: "var(--color-dunzo)" },
]

const chartConfig = {
  grns: {
    label: "GRNs",
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

export function ChartPieDonut() {
  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>GRN Cases</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="grns"
              nameKey="platform"
              innerRadius={60}
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
