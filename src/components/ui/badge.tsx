import type { ComponentProps } from "react";
import { twMerge } from "@/utils/tw-merge";
export function Badge({ className, ...props }: ComponentProps<"span">) {
	return (
		<span
			data-slot="badge"
			className={twMerge(
				"inline-flex items-center gap-1 rounded-md border border-border bg-muted px-2 py-0.5 text-[11px] font-medium leading-5 whitespace-nowrap",
				className,
			)}
			{...props}
		/>
	);
}
