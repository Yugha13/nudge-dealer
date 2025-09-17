"use client"

import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import type { ChartConfig } from "@/components/ui/chart"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

export const description = "A stacked bar chart with a legend"

const chartData = [
  { platform: "swiggy", gmv: 186, gmvloss: 80 },
  { platform: "zomato", gmv: 305, gmvloss: 200 },
  { platform: "blinkit", gmv: 237, gmvloss: 120 },
  { platform: "zepto", gmv: 73, gmvloss: 190 },
  { platform: "dunzo", gmv: 209, gmvloss: 130 },
  { platform: "bigbasket", gmv: 214, gmvloss: 140 },
]

const chartConfig = {
  gmv: {
    label: "GMV",
    color: "var(--chart-1)",
  },
  gmvloss: {
    label: "GMV Loss",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig

export function ChartBarStacked() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>GMV Vs GMV Loss</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="platform"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <ChartLegend content={<ChartLegendContent payload={chartData} />} />
            <Bar
              dataKey="gmv"
              stackId="a"
              fill="var(--color-gmv)"
              radius={[0, 0, 4, 4]}
            />
            <Bar
              dataKey="gmvloss"
              stackId="a"
              fill="var(--color-gmvloss)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
