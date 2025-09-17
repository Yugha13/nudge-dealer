import { HoverEffect } from "./ui/card-hover-effect";

export function AIFeatureCard() {
  return (
    <div className="max-w-5xl mx-auto px-8">
      <HoverEffect items={projects} />
    </div>
  );
}
export const projects = [
  {
    title: "AI Insights",
    description: "Unlock powerful AI-driven insights to analyze your data and make informed business decisions.",
    link: "#",
    icon: (
      <div className="p-2 rounded-lg bg-primary/10 text-primary">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
          <path d="M12 2v4" />
          <path d="m16.24 7.76 2.83-2.83" />
          <path d="M18 12h4" />
          <path d="m16.24 16.24 2.83 2.83" />
          <path d="M12 18v4" />
          <path d="m7.76 16.24-2.83 2.83" />
          <path d="M6 12H2" />
          <path d="m7.76 7.76-2.83-2.83" />
        </svg>
      </div>
    )
  },
  {
    title: "Task Creation",
    description: "Automate routine work and simplify complex task flows.",
    link: "#",
    icon: (
      <div className="p-2 rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
          <path d="M12 2v4" />
          <path d="M12 18v4" />
          <path d="M12 6v12" />
          <path d="M6 12h12" />
          <path d="M6 6h12" />
          <path d="M6 18h12" />
        </svg>
      </div>
    )
  },
  {
    title: "Predictive Forecasting",
    description: "Anticipate trends and outcomes with advanced AI predictions.",
    link: "#",
    icon: (
      <div className="p-2 rounded-lg bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
          <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
          <path d="M21 3v5h-5" />
        </svg>
      </div>
    )
  },
  {
    title: "AI for Strategy",
    description: "Craft winning strategies with AI-powered recommendations.",
    link: "#",
    icon: (
      <div className="p-2 rounded-lg bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
          <path d="M12 2v4" />
          <path d="M12 18v4" />
          <path d="M4.93 4.93 7.76 7.76" />
          <path d="m16.24 16.24 2.83 2.83" />
          <path d="M2 12h4" />
          <path d="M18 12h4" />
          <path d="m4.93 19.07 2.83-2.83" />
          <path d="m16.24 7.76 2.83-2.83" />
        </svg>
      </div>
    )
  },
  {
    title: "Trend Discovery",
    description: "Spot emerging opportunities before anyone else.",
    link: "#",
    icon: (
      <div className="p-2 rounded-lg bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
          <path d="m2 2 20 20" />
          <path d="M8.35 8.52A3.99 3.99 0 0 0 8 12c0 1.1.45 2.1 1.17 2.83" />
          <path d="M6.81 6.81A7.86 7.86 0 0 0 4 12c0 4.42 3.58 8 8 8 1.81 0 3.5-.6 4.85-1.62" />
          <path d="M19.42 15.86A7.86 7.86 0 0 0 20 12a8 8 0 0 0-8-8 8 8 0 0 0-2.52.41" />
          <path d="M12 12a3 3 0 0 0 3-3 3 3 0 0 0-3-3 3 3 0 0 0-3 3 3 3 0 0 0 3 3Z" />
        </svg>
      </div>
    )
  },
  {
    title: "Coming Soon",
    description: "More exciting features on the way!",
    link: "#",
    icon: (
      <div className="p-2 rounded-lg bg-gray-100 text-gray-600 dark:bg-gray-700/50 dark:text-gray-400">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
          <path d="M12 2v4" />
          <path d="M12 18v4" />
          <path d="M4.93 4.93 7.76 7.76" />
          <path d="m16.24 16.24 2.83 2.83" />
          <path d="M2 12h4" />
          <path d="M18 12h4" />
          <path d="m4.93 19.07 2.83-2.83" />
          <path d="m16.24 7.76 2.83-2.83" />
        </svg>
      </div>
    )
  }
];
