

import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { type ChartConfig, ChartContainer } from "@/components/ui/chart"
import { SumOfBilling } from "@/lib/calculation"

export const description = "A radial chart with text"




export default function ChartRadialText() {


function formatIndianNumber(num:number) {
let value, unit;

if (num >= 1e7) {        // crore
  value = num / 1e7;
  unit = "Cr";
} else if (num >= 1e5) { // lakh
  value = num / 1e5;
  unit = "L";
} else if (num >= 1e3) { // thousand
  value = num / 1e3;
  unit = "K";
} else {
  return num.toString();
}

// Decide decimal places based on digits before point
const intPart = Math.floor(value).toString().length;
const decimals = intPart === 1 ? 2 : 1;

return parseFloat(value.toFixed(decimals) + unit);
}


const chartData = [
  { browser: "safari", visitors: formatIndianNumber(SumOfBilling()), fill: "var(--chart-2)" },
]

const chartConfig = {
  visitors: {
    label: "Rev",
  },
  safari: {
    label: "Safari",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig



  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Revenue Vs Target</CardTitle>
        <CardDescription>January - Sept 2025</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <RadialBarChart
            data={chartData}
            startAngle={0}
            endAngle={250}
            innerRadius={80}
            outerRadius={110}
          >
            <PolarGrid
              gridType="circle"
              radialLines={false}
              stroke="none"
              className="first:fill-muted last:fill-background"
              polarRadius={[86, 74]}
            />
            <RadialBar dataKey="Rev" background cornerRadius={10} />
            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-4xl font-bold"
                        >
                          {chartData[0].visitors.toLocaleString()+"Cr"}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          revenue
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </PolarRadiusAxis>
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
