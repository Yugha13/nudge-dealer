"use client"

import * as React from "react"
import { Pie, PieChart, Cell, ResponsiveContainer, Tooltip } from "recharts"
import { Button } from "@/components/ui/button"
import { SumOfBilling } from "@/lib/calculation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

// Format number to Indian currency format (3 digits: X.XXCr or X.XXL)
const formatIndianCurrency = (num: number): string => {
  if (num >= 10000000) {
    const cr = num / 10000000
    return `${cr.toFixed(2).replace(/\.?0+$/, '')}Cr`
  }
  if (num >= 100000) {
    const lk = num / 100000
    return `${lk.toFixed(2).replace(/\.?0+$/, '')}L`
  }
  return num.toLocaleString('en-IN')
}

interface RevenueData {
  name: string
  value: number
  color: string
  label: string
  [key: string]: string | number
}

interface TargetData {
  category: string
  isRealTime: boolean
  targetValue: number
}

export function DashboardRevenue() {
  const [data, setData] = React.useState<RevenueData[]>([])
  const [currentRevenue, setCurrentRevenue] = React.useState<number>(0)
  const [target, setTarget] = React.useState<number>(0)
  const [progress, setProgress] = React.useState<number>(0)
  const [hasTarget, setHasTarget] = React.useState<boolean>(false)
  const [isHovered, setIsHovered] = React.useState(false)
  const tooltipRef = React.useRef<HTMLDivElement>(null)

  // Load and update revenue data
  React.useEffect(() => {
    const updateData = () => {
      const current = SumOfBilling()
      setCurrentRevenue(current)
      
      // Check for target in localStorage
      const savedTargets = localStorage.getItem('business-targets')
      if (savedTargets) {
        const targets: TargetData[] = JSON.parse(savedTargets)
        const revenueTarget = targets.find((t: TargetData) => t.category === 'revenue' && t.isRealTime)
        
        if (revenueTarget) {
          const targetValue = revenueTarget.targetValue || 0
          const progressValue = targetValue > 0 ? Math.min(100, (current / targetValue) * 100) : 0
          
          setTarget(targetValue)
          setProgress(progressValue)
          setHasTarget(true)
          
          // Update chart data
          const newData = [
            { 
              name: 'Achieved', 
              value: current, 
              color: '#4CAF50',
              label: `Achieved: ${formatIndianCurrency(current)}`
            },
            { 
              name: 'Remaining', 
              value: Math.max(0, targetValue - current), 
              color: '#E0E0E0',
              label: `Target: ${formatIndianCurrency(targetValue)}`
            }
          ]
          
          setData(newData)
          return
        }
      }
      
      // No target set
      setHasTarget(false)
      setData([
        { 
          name: 'Revenue', 
          value: 100, 
          color: '#4CAF50',
          label: `Revenue: ${formatIndianCurrency(current)}`
        }
      ])
    }
    
    // Initial update
    updateData()
    
    // Update every 2 seconds
    const interval = setInterval(updateData, 2000)
    return () => clearInterval(interval)
  }, [])

  const renderTooltipContent = () => (
    <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
      <p className="font-medium text-sm">
        <span className="text-amber-600 dark:text-amber-400">Target:</span> ₹{formatIndianCurrency(target)}
      </p>
      <p className="font-medium text-sm">
        <span className="text-green-600 dark:text-green-400">Achieved:</span> ₹{formatIndianCurrency(currentRevenue)}
      </p>
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
        {progress.toFixed(1)}% of target
      </p>
    </div>
  )
  

  const handleAddTarget = (): void => {
    if (typeof window !== 'undefined') {
      window.location.href = '/target'
    }
}


    return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle>Target vs Achieved Revenue</CardTitle>
        <CardDescription>
          {hasTarget ? 'Track your revenue progress' : 'Set a target to track your revenue progress'}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col h-[calc(100%-80px)]">
        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-xs h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Tooltip content={renderTooltipContent} />
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={isHovered ? 85 : 80}
                  paddingAngle={2}
                  dataKey="value"
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                  className="transition-all duration-300"
                >
                  {data.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.color} 
                      stroke="#fff"
                      strokeWidth={2}
                    />
                  ))}
                  <text
                    x="50%"
                    y="50%"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="text-2xl font-bold transition-all duration-300"
                    style={{
                      transform: isHovered ? 'scale(1.05)' : 'scale(1)'
                    }}
                  >
                    {formatIndianCurrency(currentRevenue)}
                  </text>
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* <div className="text-center">
          {hasTarget ? (
            <div className="mt-4">
              <div className="w-full px-2">
                <div className="mx-auto max-w-max">
                  <span className={`
                    text-xs sm:text-sm font-medium text-center
                    ${progress < 100 ? 'text-amber-600 dark:text-amber-400' : 'text-green-600 dark:text-green-400'}
                    bg-opacity-10 px-3 py-1 rounded-full
                    transition-colors duration-300
                    whitespace-nowrap overflow-hidden text-ellipsis
                    max-w-full inline-block
                  `}>
                    {progress < 100 
                      ? `₹${formatIndianCurrency(target - currentRevenue)} more to target`
                      : '🎯 Target Achieved!'}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-4">
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleAddTarget}
              >
                Set Target
              </Button>
            </div>
          )}
        </div> */}
      </CardContent>
    </Card>
  )
}
