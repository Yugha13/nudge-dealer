import { TrendingUp, DollarSign, Zap } from 'lucide-react';
import { Card, CardContent } from '../ui/card';

const highlights = [
  {
    title: 'Top Revenue',
    platform: 'Blinkit',
    value: '₹2.4M',
    growth: '+12.3%',
    icon: DollarSign,
    gradient: 'from-success to-success/80',
    bgGradient: 'bg-gradient-to-br from-success/10 to-success/5'
  },
  {
    title: 'Best Performing',
    platform: 'Instamart',
    value: '94.2%',
    growth: '+5.7%',
    icon: TrendingUp,
    gradient: 'from-primary to-primary/80',
    bgGradient: 'bg-gradient-to-br from-primary/10 to-primary/5'
  },
  {
    title: 'Fastest Growing',
    platform: 'Zepto',
    value: '+28.4%',
    growth: '+8.1%',
    icon: Zap,
    gradient: 'from-warning to-warning/80',
    bgGradient: 'bg-gradient-to-br from-warning/10 to-warning/5'
  }
];

export default function HighlightCards() {
  return (
    <div className="grid md:grid-cols-5 gap-6 mb-12">
      <div className='text-2xl font-bold col-span-2'>
        <div>
        Platform Comparision
        </div>
        <div className='text-xl font-medium text-foreground/50'>
        Comparing all the KPI's across all platforms
        </div>
      </div>
      {highlights.map((highlight, index) => (
        <Card key={index} >
          <CardContent >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground/50">
                  {highlight.title}
                </p>
                <p className="text-xl font-bold text-foreground">
                  {highlight.platform}
                </p>
                <div className="flex items-baseline space-x-2">
                  <span className="text-md font-bold text-foreground">
                    {highlight.value}
                  </span>
                  <span className="text-sm font-medium text-success">
                    {highlight.growth}
                  </span>
                </div>
              </div>

            </div>

          </CardContent>
        </Card>
      ))}
    </div>
  );
}