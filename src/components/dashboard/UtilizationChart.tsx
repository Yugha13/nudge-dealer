"use client"


import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts"

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

export const description = "A bar chart with a label"

const chartData = [
  { month: "January", desktop: 18600 },
  { month: "February", desktop: 30500 },
  { month: "March", desktop: 23700 },
  { month: "April", desktop: 7300 },
  { month: "May", desktop: 20900 },
  { month: "June", desktop: 24400 },
  { month: "July", desktop: 6400},
  { month: "August", desktop: 4400},
  { month: "September", desktop: 14400},
]

const chartConfig = {
  desktop: {
    label: "Pos",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

export default function ChartBarLabel() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly POs (mockup data)</CardTitle>
        <CardDescription>January - Sept 2025</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{
              top: 20,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="desktop" fill="var(--color-desktop)" radius={8}>
              <LabelList
                position="top"
                offset={12}
                className="fill-foreground"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
