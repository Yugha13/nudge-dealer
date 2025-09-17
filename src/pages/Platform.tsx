// ... existing code ...
import HighlightCards from '@/components/dashboard/HighlightCards';
import PlatformOverview from '@/components/dashboard/PlatformOverview';
import { ChartBarHorizontal } from '@/charts/chart1';
import { ChartPieDonut } from '@/charts/chart2';
import { ChartBarStacked } from '@/charts/chart4';
import { ChartRadialSimple } from '@/charts/chart3';


export default function PlatformComparison() {
  return (
    <>
      <div className="min-h-screen bg-background">
        <div className="p-4">
          <HighlightCards />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2">
              <div className="grid lg:grid-cols-2 grid-rows-2 gap-4">
                <ChartRadialSimple/>
                <ChartBarStacked/>
                <ChartBarHorizontal/>
                <ChartPieDonut />
              </div>
            </div>
            <div className="lg:col-span-1">
              <div className="dashboard-card h-[calc(100vh-15rem)] flex flex-col">
                <PlatformOverview />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
