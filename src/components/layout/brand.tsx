import { twMerge } from "@/utils/tw-merge";

export function Brand({ className }: { className?: string }) {
	return (
		<span className={twMerge("inline-flex items-center gap-2.5", className)}>
			<span className="font-display text-4xl font-bold tracking-[-0.055em]">Trackwise</span>
		</span>
	);
}
