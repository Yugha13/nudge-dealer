import { XAxis, YAxis, ResponsiveContainer, Tooltip, Area, AreaChart } from "recharts";

const data = [
  { name: "Jan", value: 2.1 },
  { name: "Feb", value: 2.8 },
  { name: "Mar", value: 1.9 },
  { name: "Apr", value: 3.2 },
  { name: "May", value: 2.5 },
  { name: "Jun", value: 4.1 },
  { name: "Jul", value: 3.7 },
  { name: "Aug", value: 4.5 },
  { name: "Sep", value: 5.2 },
];

interface ExpenseChartProps {
  className?: string;
}

export function ExpenseChart({ className = "" }: ExpenseChartProps) {
  return (
    <div className={`h-32 w-full ${className} group`}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--chart-secondary))" stopOpacity={0.4}/>
              <stop offset="95%" stopColor="hsl(var(--chart-secondary))" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <XAxis 
            dataKey="name" 
            axisLine={false}
            tickLine={false}
            tick={false}
          />
          <YAxis hide />
          <Tooltip
            contentStyle={{
              backgroundColor: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px',
              boxShadow: 'var(--shadow-card)',
            }}
            formatter={(value) => [`$${value}k`, 'Monthly Expense']}
            cursor={{ strokeDasharray: '3 3' }}
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke="hsl(var(--chart-secondary))"
            strokeWidth={3}
            fill="url(#colorValue)"
            className="transition-all duration-300 group-hover:stroke-[4px]"
            dot={{ r: 4, fill: 'hsl(var(--chart-secondary))', strokeWidth: 0 }}
            activeDot={{ 
              r: 6, 
              fill: 'hsl(var(--chart-secondary))', 
              stroke: 'hsl(var(--background))',
              strokeWidth: 2,
            }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}