import { WobbleCard } from "./ui/wobble-card";

export function WobbleCards() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 max-w-7xl mx-auto w-full">
      <WobbleCard
        containerClassName="col-span-1 lg:col-span-1 h-full bg-pink-800 min-h-[500px] lg:min-h-[300px]"
        className=""
      >
        <div className="max-w-xs">
          <h2 className="text-left text-balance text-base md:text-xl lg:text-3xl font-semibold tracking-[-0.015em] text-white">
            AI Insights
          </h2>
          <p className="mt-4 text-left text-base/6 text-neutral-200">
            Unlock powerful AI-driven insights to analyze your data and make informed business decisions.
          </p>
        </div>
      </WobbleCard>
      <WobbleCard containerClassName="col-span-1 min-h-[300px]">
        <h2 className="max-w-80 text-left text-balance text-base md:text-xl lg:text-3xl font-semibold tracking-[-0.015em] text-white">
          Task Creation
        </h2>
        <p className="mt-4 max-w-[26rem] text-left text-base/6 text-neutral-200">
          Automate and streamline your workflow with intelligent task generation and management.
        </p>
      </WobbleCard>
      <WobbleCard containerClassName="col-span-1 min-h-[300px]">
        <h2 className="max-w-80 text-left text-balance text-base md:text-xl lg:text-3xl font-semibold tracking-[-0.015em] text-white">
            Trend Discovery
        </h2>
        <p className="mt-4 max-w-[26rem] text-left text-base/6 text-neutral-200">
            Identify emerging patterns and opportunities in your data with our powerful analytics tools.    
        </p>
      </WobbleCard>
      <WobbleCard containerClassName="col-span-1 lg:col-span-2 bg-blue-900 min-h-[500px] lg:min-h-[600px] xl:min-h-[300px]">
        <div className="max-w-sm">
          <h2 className="max-w-sm md:max-w-lg text-left text-balance text-base md:text-xl lg:text-3xl font-semibold tracking-[-0.015em] text-white">
            Predictive Forecasting
          </h2>
          <p className="mt-4 max-w-[26rem] text-left text-base/6 text-neutral-200">
            Anticipate future trends and outcomes with our advanced forecasting algorithms.
          </p>
        </div>
        <img
          src="/linear.webp"
          width={500}
          height={500}
          alt="linear demo image"
          className="absolute -right-10 md:-right-[40%] lg:-right-[20%] -bottom-10 object-contain rounded-2xl"
        />
      </WobbleCard>
      <WobbleCard
        containerClassName="col-span-1 lg:col-span-1 h-full bg-pink-800 min-h-[500px] lg:min-h-[300px]"
        className=""
      >
        <div className="max-w-xs">
          <h2 className="text-left text-balance text-base md:text-xl lg:text-3xl font-semibold tracking-[-0.015em] text-white">
            AI for Strategy
          </h2>
          <p className="mt-4 text-left text-base/6 text-neutral-200">
            Leverage AI to develop and optimize your business strategies for maximum impact.
          </p>
        </div>
      </WobbleCard>
    </div>
  );
}
