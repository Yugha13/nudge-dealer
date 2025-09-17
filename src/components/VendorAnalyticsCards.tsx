import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, Clock, CheckCircle, BarChart2, ArrowRight, Users, Package } from "lucide-react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface AnalyticsCardProps {
  title: string
  value: string
  description: string
  trend: "up" | "down" | "neutral"
  trendValue: string
  icon: React.ComponentType<{ className?: string }>
  color: "success" | "warning" | "info"
}

const AnalyticsCard = ({ title, value, description, trend, trendValue, icon: Icon, color }: AnalyticsCardProps) => {
  const colorClasses = {
    success: "bg-gradient-success text-white",
    warning: "bg-gradient-warning text-white", 
    info: "bg-gradient-info text-white"
  }

  return (
    <motion.div 
      className="h-full"
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 15 }}
    >
      <Card className="group relative overflow-hidden h-full border border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300 hover:border-primary/20">
        <div className="absolute inset-0 bg-gradient-to-br from-transparent to-muted/5 group-hover:to-primary/5 transition-colors duration-500"></div>
        <CardHeader className="relative pb-2">
          <div className="flex items-center justify-between">
            <div className={`w-12 h-12 rounded-xl ${colorClasses[color]} flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300`}>
              <Icon className="w-6 h-6" />
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-muted/50 group-hover:bg-muted/80 transition-colors">
              {trend === "up" ? (
                <TrendingUp className="w-4 h-4 text-success" />
              ) : trend === "down" ? (
                <TrendingDown className="w-4 h-4 text-destructive" />
              ) : <BarChart2 className="w-4 h-4 text-muted-foreground" />}
              <span className={cn(
                "text-xs font-medium",
                trend === "up" ? "text-success" : 
                trend === "down" ? "text-destructive" : "text-muted-foreground"
              )}>
                {trendValue}
              </span>
            </div>
          </div>
          <CardTitle className="text-3xl font-bold text-foreground mt-3">{value}</CardTitle>
          <CardDescription className="text-sm text-muted-foreground">{title}</CardDescription>
        </CardHeader>
        <CardContent className="relative pt-0">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">{description}</p>
            <motion.div 
              className="text-primary opacity-0 group-hover:opacity-100 transition-opacity"
              whileHover={{ x: 3 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <ArrowRight className="w-4 h-4" />
            </motion.div>
          </div>
          
          {/* Enhanced sparkline visualization */}
          <div className="mt-4 h-16 flex items-end gap-0.5">
            {[...Array(12)].map((_, i) => {
              const height = Math.random() * 40 + 15;
              return (
                <motion.div
                  key={i}
                  className={cn(
                    "flex-1 rounded-t-sm",
                    colorClasses[color],
                    "opacity-20 group-hover:opacity-30 transition-opacity"
                  )}
                  initial={{ height: 0 }}
                  animate={{ height: `${height}%` }}
                  transition={{
                    duration: 0.6,
                    delay: i * 0.05,
                    type: "spring",
                    damping: 10
                  }}
                  whileHover={{ 
                    opacity: 0.6,
                    transition: { duration: 0.2 }
                  }}
                />
              );
            })}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export function VendorAnalyticsCards() {
  const analyticsData = [
    {
      title: "Active Vendors",
      value: "142",
      description: "Out of 165 total vendors",
      trend: "up" as const,
      trendValue: "+8.5%",
      icon: Users,
      color: "success" as const
    },
    {
      title: "Average Fill Rate", 
      value: "94.2%",
      description: "Orders fulfilled completely",
      trend: "up" as const,
      trendValue: "+2.1%",
      icon: CheckCircle,
      color: "info" as const
    },
    {
      title: "Monthly Shipments",
      value: "1,284",
      description: "Completed this month",
      trend: "up" as const,
      trendValue: "+15.3%",
      icon: Package,
      color: "warning" as const
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {analyticsData.map((data, index) => (
        <div key={data.title} className="animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
          <AnalyticsCard {...data} />
        </div>
      ))}
    </div>
  )
}