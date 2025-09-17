import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

const fillRateData = [
  { platform: 'Blinkit', fillRate: 94 },
  { platform: 'Instamart', fillRate: 89 },
  { platform: 'Zepto', fillRate: 92 },
  { platform: 'Dunzo', fillRate: 78 },
  { platform: 'BigBasket', fillRate: 85 },
  { platform: 'Zomato', fillRate: 87 }
];

const gmvData = [
  { month: 'Jan', gmv: 420, loss: 45 },
  { month: 'Feb', gmv: 485, loss: 38 },
  { month: 'Mar', gmv: 520, loss: 42 },
  { month: 'Apr', gmv: 580, loss: 35 },
  { month: 'May', gmv: 635, loss: 40 },
  { month: 'Jun', gmv: 720, loss: 32 }
];

const marginData = [
  { platform: 'Blinkit', margin: 15.2 },
  { platform: 'Instamart', margin: 12.8 },
  { platform: 'Zepto', margin: 18.5 },
  { platform: 'Dunzo', margin: 8.3 },
  { platform: 'BigBasket', margin: 14.7 },
  { platform: 'Zomato', margin: 11.9 }
];

const pieData = [
  { name: 'Pending', value: 234, color: '#ef4444' },
  { name: 'In Transit', value: 456, color: '#f59e0b' },
  { name: 'Delivered', value: 1234, color: '#10b981' },
  { name: 'Cancelled', value: 89, color: '#6b7280' }
];


export default function AnalyticsSection() {
  return (
    <div className="space-y-6">
      {/* Charts Grid - 2 per row */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Fill Rate Chart */}
        <div className="chart-container">
          <h3 className="text-lg font-semibold text-foreground mb-4">Fill Rate by Platform</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={fillRateData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="platform" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))', 
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
              />
              <Bar dataKey="fillRate" fill="hsl(var(--primary))" radius={4} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* GMV vs Loss Chart */}
        <div className="chart-container">
          <h3 className="text-lg font-semibold text-foreground mb-4">GMV vs GMV Loss</h3>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={gmvData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))', 
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
              />
              <Line type="monotone" dataKey="gmv" stroke="hsl(var(--primary))" strokeWidth={3} />
              <Line type="monotone" dataKey="loss" stroke="hsl(var(--destructive))" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Margin Chart */}
        <div className="chart-container">
          <h3 className="text-lg font-semibold text-foreground mb-4">Margin % by Platform</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={marginData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="platform" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))', 
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
              />
              <Bar dataKey="margin" fill="hsl(var(--success))" radius={4} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pending GRNs */}
        <div className="chart-container">
          <h3 className="text-lg font-semibold text-foreground mb-4">Pending GRNs Status</h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))', 
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center flex-wrap gap-2 mt-2">
            {pieData.map((entry, index) => (
              <div key={index} className="flex items-center space-x-1">
                <div 
                  className="w-2 h-2 rounded-full" 
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-xs text-muted-foreground">{entry.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}