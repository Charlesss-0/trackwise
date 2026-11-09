import type { ComponentProps } from "react";
import { twMerge } from "@/utils/tw-merge";
export const inputStyles =
	"flex h-10 w-full min-w-0 rounded-lg border border-input bg-card px-3 py-2 text-base md:text-sm transition-colors outline-none placeholder:text-muted-foreground/70 focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/20 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20";
export function Input({ className, type, ...props }: ComponentProps<"input">) {
	return (
		<input
			data-slot="input"
			type={type}
			className={twMerge(inputStyles, "file:border-0 file:bg-transparent file:text-sm file:font-medium", className)}
			{...props}
		/>
	);
}
