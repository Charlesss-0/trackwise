import type { LucideIcon } from "lucide-react";

type EmptyStateProps = {
	icon: LucideIcon;
	title: string;
	description: string;
	actionLabel?: string;
	onAction?: () => void;
};

export function EmptyState({ icon: Icon, title, description, actionLabel, onAction }: EmptyStateProps) {
	return (
		<div className="flex flex-col items-center justify-center py-16 text-center">
			<div className="bg-base-200 rounded-full p-4 mb-4">
				<Icon className="w-10 h-10 text-base-content/40" />
			</div>
			<h3 className="text-lg font-semibold mb-1">{title}</h3>
			<p className="text-base-content/60 max-w-sm mb-6">{description}</p>
			{actionLabel && onAction && (
				<button type="button" className="btn btn-primary" onClick={onAction}>
					{actionLabel}
				</button>
			)}
		</div>
	);
}
