import type { ReactNode } from "react";
import { Card, CardContent } from "./card";

type StatCardProps = {
	label: string;
	value: string;
	icon?: ReactNode;
	trend?: "positive" | "negative" | "neutral";
	description?: string;
	featured?: boolean;
};
export function StatCard({ label, value, icon, trend = "neutral", description, featured }: StatCardProps) {
	return (
		<Card className={featured ? "border-primary bg-primary text-primary-foreground" : ""}>
			<CardContent>
				<div className="mb-5 flex items-center justify-between gap-3">
					<h2 className={`text-sm font-medium ${featured ? "text-primary-foreground/80" : "text-muted-foreground"}`}>{label}</h2>
					<div
						className={`flex size-8 items-center justify-center rounded-lg [&_svg]:size-4 ${featured ? "bg-primary-foreground/10" : "bg-muted text-muted-foreground"}`}
					>
						{icon}
					</div>
				</div>
				<div
					className={`font-display text-[clamp(1.5rem,2.4vw,2rem)] font-semibold tracking-tight tabular-nums ${!featured && trend === "negative" ? "text-destructive" : ""}`}
				>
					{value}
				</div>
				{description && <p className={`mt-2 text-xs ${featured ? "text-primary-foreground/70" : "text-muted-foreground"}`}>{description}</p>}
			</CardContent>
		</Card>
	);
}
