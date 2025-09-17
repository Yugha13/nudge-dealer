import { useState } from 'react';
import { ChevronRight, TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { FillRate, SumOfBilling, TotalOrders } from '@/lib/calculation';



export default function PlatformOverview() {
  // @ts-ignore
  function formatIndianNumber(num) {
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

  return value.toFixed(decimals) + unit;
}

  const platforms = [
  {
    id: 7,
    name: 'Swiggy Instamart',
    logo: '🛍️',
    revenue: formatIndianNumber(SumOfBilling()),
    orders: formatIndianNumber(TotalOrders()),
    fillRate: formatIndianNumber(FillRate().toPrecision(2)),
    status: 'active',
    growth: 9.3,
    color: 'bg-yellow-500'
  },
  {
    id: 1,
    name: 'Blinkit',
    isMock: true,
    logo: '🏪',
    revenue: '₹2.4M',
    orders: '12.5K',
    fillRate: 94.2,
    status: 'active',
    growth: 12.3,
    color: 'bg-green-500'
  },
  {
    id: 2,
    name: 'Instamart',
    isMock: true,
    logo: '🛒',
    revenue: '₹2.1M',
    orders: '10.8K',
    fillRate: 89.1,
    status: 'active',
    growth: 8.7,
    color: 'bg-blue-500'
  },
  {
    id: 3,
    name: 'Zepto',
    logo: '⚡',
    isMock: true,
    revenue: '₹1.8M',
    orders: '9.2K',
    fillRate: 92.5,
    status: 'active',
    growth: 28.4,
    color: 'bg-purple-500'
  },
  {
    id: 4,
    name: 'Dunzo',
    logo: '📦',
    revenue: '₹0.8M',
    isMock: true,
    orders: '4.1K',
    fillRate: 78.3,
    status: 'warning',
    growth: -2.1,
    color: 'bg-orange-500'
  },
  {
    id: 5,
    name: 'BigBasket',
    logo: '🧺',
    revenue: '₹1.5M',
    isMock: true,
    orders: '7.8K',
    fillRate: 85.7,
    status: 'active',
    growth: 5.2,
    color: 'bg-emerald-500'
  },
  {
    id: 6,
    name: 'Zomato',
    logo: '🍽️',
    revenue: '₹1.2M',
    isMock: true,
    orders: '6.5K',
    fillRate: 87.2,
    status: 'active',
    growth: 7.8,
    color: 'bg-red-500'
  },
  {
    id: 8,
    name: 'JioMart',
    logo: '🏬',
    revenue: '₹0.9M',
    isMock: true,
    orders: '4.7K',
    fillRate: 81.6,
    status: 'active',
    growth: 4.1,
    color: 'bg-indigo-500'
  }
];
  const [selectedPlatform, setSelectedPlatform] = useState<number | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-success text-success-foreground';
      case 'warning':
        return 'bg-warning text-warning-foreground';
      case 'inactive':
        return 'bg-muted text-muted-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <>
      <div className="p-6 border-b border-border flex-shrink-0">
        <h2 className="text-xl font-bold text-foreground">Platform Overview</h2>
        <p className="text-sm text-muted-foreground mt-1">
          {platforms.length} platforms • Real-time data
        </p>
      </div>
      
      <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-4" style={{ minHeight: 0 }}>
        {platforms.map((platform) => (
          <div
            key={platform.id}
            className={cn(
              "platform-card group",
              selectedPlatform === platform.id && "ring-2 ring-primary",
              platform.isMock == true && "opacity-50"
            )}
            onClick={() => setSelectedPlatform(
              selectedPlatform === platform.id ? null : platform.id
            )}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", platform.color)}>
                  <span className="text-lg">{platform.logo}</span>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{platform.name}{platform.isMock && " (Mock data)"}</h3>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className={cn(
                      "px-2 py-0.5 text-xs font-medium rounded-full",
                      getStatusColor(platform.status)
                    )}>
                      {platform.status}
                    </span>
                    <div className="flex items-center space-x-1">
                      {platform.growth > 0 ? (
                        <TrendingUp className="w-3 h-3 text-success" />
                      ) : (
                        <TrendingDown className="w-3 h-3 text-destructive" />
                      )}
                      <span className={cn(
                        "text-xs font-medium",
                        platform.growth > 0 ? "text-success" : "text-destructive"
                      )}>
                        {platform.growth > 0 ? '+' : ''}{platform.growth}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <ChevronRight className={cn(
                "w-4 h-4 text-muted-foreground transition-transform",
                selectedPlatform === platform.id && "rotate-90"
              )} />
            </div>

            <div className="grid grid-cols-3 gap-3 mt-4">
              <div>
                <p className="text-xs text-muted-foreground">Revenue</p>
                <p className="font-semibold text-foreground">{platform.revenue}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Orders</p>
                <p className="font-semibold text-foreground">{platform.orders}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Fill Rate</p>
                <p className="font-semibold text-foreground">{platform.fillRate}%</p>
              </div>
            </div>

            {/* Fill Rate Progress */}
            <div className="mt-3">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-muted-foreground">Fill Rate</span>
                <span className="text-foreground font-medium">{platform.fillRate}%</span>
              </div>
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary rounded-full transition-all duration-500"
                  style={{ width: `${platform.fillRate}%` }}
                />
              </div>
            </div>

            {/* Expanded Details */}
            {selectedPlatform === platform.id && (
              <div className="mt-4 pt-4 border-t border-border animate-in slide-in-from-top-2">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Avg. Order Value</p>
                    <p className="font-semibold">₹{Math.floor(parseInt(platform.revenue.replace('₹', '').replace('M', '')) * 1000000 / parseInt(platform.orders.replace('K', '')) / 1000)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Commission</p>
                    <p className="font-semibold">{Math.floor(Math.random() * 10) + 10}%</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Return Rate</p>
                    <p className="font-semibold">{Math.floor(Math.random() * 5) + 2}%</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Active SKUs</p>
                    <p className="font-semibold">{Math.floor(Math.random() * 1000) + 500}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
}