import type { ComponentProps } from "react";
import { twMerge } from "@/utils/tw-merge";
export function Card({ className, ...props }: ComponentProps<"div">) {
	return <div data-slot="card" className={twMerge("rounded-xl border border-border bg-card text-card-foreground", className)} {...props} />;
}
export function CardContent({ className, ...props }: ComponentProps<"div">) {
	return <div data-slot="card-content" className={twMerge("p-5 sm:p-6", className)} {...props} />;
}
export function CardHeader({ className, ...props }: ComponentProps<"div">) {
	return (
		<div
			data-slot="card-header"
			className={twMerge("flex items-center justify-between gap-4 border-b border-border px-5 py-4 sm:px-6", className)}
			{...props}
		/>
	);
}
export function CardTitle({ className, ...props }: ComponentProps<"h2">) {
	return <h2 data-slot="card-title" className={twMerge("font-display text-base font-semibold tracking-tight", className)} {...props} />;
}
