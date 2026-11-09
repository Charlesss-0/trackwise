import { type LucideIcon, Plus } from "lucide-react";
import { Button } from "./button";

type EmptyStateProps = { icon: LucideIcon; title: string; description: string; actionLabel?: string; onAction?: () => void };
export function EmptyState({ icon: Icon, title, description, actionLabel, onAction }: EmptyStateProps) {
	return (
		<div className="flex flex-col items-center justify-center px-5 py-14 text-center">
			<div className="mb-5 flex size-12 items-center justify-center rounded-xl border border-border bg-muted">
				<Icon className="size-5 text-muted-foreground" />
			</div>
			<h3 className="font-display text-base font-semibold">{title}</h3>
			<p className="mt-2 max-w-xs text-sm leading-relaxed text-muted-foreground">{description}</p>
			{actionLabel && onAction && (
				<Button type="button" variant="outline" className="mt-5" onClick={onAction}>
					<Plus />
					{actionLabel}
				</Button>
			)}
		</div>
	);
}
