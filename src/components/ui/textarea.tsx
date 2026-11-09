import type { ComponentProps } from "react";
import { twMerge } from "@/utils/tw-merge";
import { inputStyles } from "./input";
export function Textarea({ className, ...props }: ComponentProps<"textarea">) {
	return <textarea data-slot="textarea" className={twMerge(inputStyles, "h-auto min-h-20 resize-y", className)} {...props} />;
}
