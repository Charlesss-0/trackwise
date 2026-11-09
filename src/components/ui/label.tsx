import type { ComponentProps } from "react";
import { twMerge } from "@/utils/tw-merge";
export function Label({ className, htmlFor, children, ...props }: ComponentProps<"label">) {
	return (
		<label
			htmlFor={htmlFor}
			data-slot="label"
			className={twMerge("flex items-center gap-2 text-sm font-medium leading-relaxed", className)}
			{...props}
		>
			{children}
		</label>
	);
}
