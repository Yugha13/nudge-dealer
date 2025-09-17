import { LineChart, Line, ResponsiveContainer, BarChart, Bar } from "recharts";

const profileData = [
  { value: 20 }, { value: 35 }, { value: 25 }, { value: 40 }, { value: 30 }, { value: 45 }, { value: 38 }
];

const transactionData = [
  { value: 15 }, { value: 28 }, { value: 22 }, { value: 35 }, { value: 18 }, { value: 42 }, { value: 30 }
];

const productData = [
  { value: 12 }, { value: 18 }, { value: 25 }, { value: 15 }, { value: 30 }, { value: 20 }, { value: 28 }
];

interface MiniChartProps {
  type: "profile" | "transaction" | "product";
  className?: string;
}

export function MiniChart({ type, className = "" }: MiniChartProps) {
  const getData = () => {
    switch (type) {
      case "profile": return profileData;
      case "transaction": return transactionData;
      case "product": return productData;
      default: return profileData;
    }
  };

  const getColor = () => {
    switch (type) {
      case "profile": return "hsl(var(--chart-primary))";
      case "transaction": return "hsl(var(--chart-secondary))";
      case "product": return "hsl(var(--success))";
      default: return "hsl(var(--chart-primary))";
    }
  };

  return (
    <div className={`h-16 w-full ${className} group cursor-pointer`}>
      <ResponsiveContainer width="100%" height="100%">
        {type === "transaction" ? (
          <BarChart data={getData()}>
            <Bar 
              dataKey="value" 
              fill={getColor()}
              radius={[2, 2, 0, 0]}
              className="transition-all duration-300 group-hover:opacity-80"
            />
          </BarChart>
        ) : (
          <LineChart data={getData()}>
            <Line
              type="monotone"
              dataKey="value"
              stroke={getColor()}
              strokeWidth={2}
              dot={false}
              className="transition-all duration-300 group-hover:stroke-[3px]"
            />
          </LineChart>
        )}
      </ResponsiveContainer>
    </div>
  );
}
