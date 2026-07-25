import type { ReactNode } from "react";

type StatCardProps = {
  label: string;
  value: string;
  icon?: ReactNode;
  trend?: "positive" | "negative" | "neutral";
};

export function StatCard({ label, value, icon, trend = "neutral" }: StatCardProps) {
  const trendColor = trend === "positive" ? "text-success" : trend === "negative" ? "text-error" : "text-base-content";

  return (
    <div className="card bg-base-200 shadow-sm border border-base-300">
      <div className="card-body p-5">
        <div className="flex items-center justify-between text-base-content/70 mb-2">
          <h3 className="text-sm font-medium">{label}</h3>
          {icon && <div className="text-base-content/50">{icon}</div>}
        </div>
        <div className={`text-2xl font-bold tracking-tight ${trendColor}`}>{value}</div>
      </div>
    </div>
  );
}
