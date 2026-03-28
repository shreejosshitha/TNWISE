import { Lightbulb, MapPin, Sparkles, TrendingUp } from "lucide-react";
import type { InsightCard } from "../../../backend/adminApi";

const iconMap = {
  "Hotspot Area": <MapPin className="h-5 w-5 text-white" />,
  "Top complaint type": <TrendingUp className="h-5 w-5 text-white" />,
  "Week-over-week trend": <Sparkles className="h-5 w-5 text-white" />,
  "Average resolution time": <Lightbulb className="h-5 w-5 text-white" />,
};

interface InsightsPanelProps {
  insights: InsightCard[];
}

export function InsightsPanel({ insights }: InsightsPanelProps) {
  return (
    <div className="grid gap-4 lg:grid-cols-4">
      {insights.map((insight) => (
        <div key={insight.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-5 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div className="rounded-2xl bg-slate-900 p-3 text-white">{iconMap[insight.title as keyof typeof iconMap] || <Sparkles className="h-5 w-5" />}</div>
            <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Insight</span>
          </div>
          <h4 className="mt-6 text-xl font-semibold text-slate-900">{insight.value}</h4>
          <p className="mt-2 text-sm text-slate-600">{insight.title}</p>
          <p className="mt-3 text-sm text-slate-500">{insight.description}</p>
        </div>
      ))}
    </div>
  );
}
