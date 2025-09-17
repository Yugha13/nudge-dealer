import { type ReactNode } from "react";
import { TrendingUp, TrendingDown, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MiniChart } from "./MiniChart";

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  icon?: ReactNode;
  className?: string;
  onClick?: () => void;
  chartType?: "profile" | "transaction" | "product";
}

export function MetricCard({ 
  title, 
  value, 
  subtitle, 
  trend, 
  icon, 

  onClick,
  chartType
}: MetricCardProps) {
  return (
    <Card onClick={onClick} className="flex flex-col justify-center">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
          {title}
        </CardTitle>
        <div className="flex items-center gap-2">
          {icon && (
            <div className="p-2 rounded-lg bg-accent/50 text-accent-foreground group-hover:bg-primary/20 group-hover:text-primary transition-all duration-300 group-hover:rotate-12 group-hover:scale-110">
              {icon}
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent>
        {/* Animated background gradient */}
        <div className="inset-0 bg-gradient-to-r from-primary/5 via-transparent to-orange/5 opacity-0 group-hover:opacity-100 transition-all duration-500" />
        
        <div className="relative z-10">
          <div className="text-3xl font-bold text-foreground mb-1 group-hover:text-primary transition-colors duration-300">
            {value}
          </div>
          
          <div className="flex items-center gap-2 text-sm">
            {subtitle && (
              <span className="text-muted-foreground group-hover:text-foreground transition-colors duration-300">{subtitle}</span>
            )}
            
            {trend && (
              <div className={`flex items-center gap-1 transition-all duration-300 ${
                trend.isPositive ? 'text-success group-hover:scale-110' : 'text-destructive group-hover:scale-110'
              }`}>
                {trend.isPositive ? (
                  <TrendingUp className="h-3 w-3" />
                ) : (
                  <TrendingDown className="h-3 w-3" />
                )}
                <span className="font-medium">
                  {Math.abs(trend.value)}%
                </span>
              </div>
            )}
          </div>
          
          {/* Mini Chart */}
          {chartType && (
            <div className="mt-4">
              <MiniChart type={chartType} />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}