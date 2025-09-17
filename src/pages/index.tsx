import { Card, CardContent } from "@/components/ui/card";
import PerformanceGauge  from "@/components/dashboard/PerformanceGauge";
import { MetricCard } from "@/components/dashboard/MetricCard";
import UtilizationChart  from "@/components/dashboard/UtilizationChart";
import { 
  Users,
  Package, 
  CreditCard,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { FillRate, LineFillRate, NonZeroFillRate } from "@/lib/calculation"
import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts"

import {
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { type ChartConfig, ChartContainer } from "@/components/ui/chart"
import { SumOfBilling } from "@/lib/calculation"

export const description = "A radial chart with text"

export default function DealersDashboard() {

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
    <div className="px-6 space-y-6">
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left Column - Cards */}
        <div className="xl:col-span-1 flex flex-col h-[calc(100vh-2rem)] gap-4 py-4">
          {/* Welcome Card - 1 part */}
          <div className="h-1/4">
            <Card className="h-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 text-white shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="h-full p-6">
                <div className="flex items-center justify-between h-full">
                  <div className="space-y-3">
                    <div>
                      <h2 className="text-2xl font-bold">Welcome back, John!</h2>
                      <p className="text-blue-100 mt-1">Have a great day at work</p>
                    </div>
                  </div>
                  <div className="bg-white/20 p-3 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Performance Gauge - 2 parts */}
          <div className="h-2/4">
            <div className="h-full w-full p-2">
              <Card className="h-full flex flex-col">
                <CardHeader className="items-center p-4 pb-2">
                  <CardTitle className="text-lg">Revenue Vs Target</CardTitle>
                  <CardDescription className="text-xs">January - Sept 2025</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex items-center justify-center p-2">
                  <ChartContainer
                    config={chartConfig}
                    className="w-full h-full max-h-[200px]"
                  >
                    <RadialBarChart
                      data={chartData}
                      startAngle={0}
                      endAngle={250}
                      innerRadius="70%"
                      outerRadius="100%"
                    >
                      <PolarGrid
                        gridType="circle"
                        radialLines={false}
                        stroke="none"
                        className="first:fill-muted last:fill-background"
                        polarRadius={[86, 74]}
                      />
                      <RadialBar 
                        dataKey="Rev" 
                        background 
                        cornerRadius={10} 
                        className="fill-primary"
                      />
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
                                    className="fill-foreground text-2xl font-bold"
                                  >
                                    {chartData[0].visitors.toLocaleString()+"Cr"}
                                  </tspan>
                                  <tspan
                                    x={viewBox.cx}
                                    y={(viewBox.cy || 0) + 24}
                                    className="fill-muted-foreground text-sm"
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
            </div>
          </div>
          
          {/* AI Assistance Card - 1 part */}
          <div className="h-1/4">
            <Card className="h-full p-0">
              <CardContent className="h-full p-6 flex flex-col items-center justify-center text-center">
                <h3 className="text-xl font-bold mb-2 text-purple-600">Need Assistance?</h3>
                <p className="mb-4 text-foreground">Get actionable insights and recommendations.</p>
                <Button 
                  variant="secondary" 
                  className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                  onClick={() => console.log("Chat with AI clicked")}
                >
                  Keep Chat with Me
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Right Column - Analytics */}
        <div className="xl:col-span-2 flex flex-col h-[calc(100vh-2rem)] gap-4 py-4">
          <div className="h-[60%] min-h-0 mb-6">
            <UtilizationChart />
          </div>
          {/* Bottom Stats Row */}
          <div className="h-[40%] min-h-0">
            <div className="h-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {/* Dealer Profiles */}
            <MetricCard
              title="Fill Rate"
              value={FillRate().toPrecision(2).toString()+"%"}
              subtitle="7 platforms avg"
              trend={{ value: 12, isPositive: true }}
              icon={<Users className="h-4 w-4" />}
              chartType="profile"
            />

            {/* Transactions */}
            <MetricCard
              title="Line fill rate"
              value={LineFillRate().toPrecision(2).toString()+"%"}
              subtitle="7 platforms avg"
              trend={{ value: 8, isPositive: true }}
              icon={<CreditCard className="h-4 w-4" />}
              chartType="transaction"
            />

            {/* Products */}
            <MetricCard
              title="NZFR"
              value={NonZeroFillRate().toPrecision(2).toString()+"%"}
              subtitle="7 New Products"
              trend={{ value: 5, isPositive: true }}
              icon={<Package className="h-4 w-4" />}
              chartType="product"
            />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}