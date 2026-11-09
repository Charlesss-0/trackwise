import { ChevronDown } from "lucide-react";
import type { ComponentProps } from "react";
import { twMerge } from "@/utils/tw-merge";
import { inputStyles } from "./input";
export function NativeSelect({ className, ...props }: ComponentProps<"select">) {
	return (
		<div data-slot="native-select-wrapper" className="relative w-full min-w-0">
			<select data-slot="native-select" className={twMerge(inputStyles, "appearance-none pr-9", className)} {...props} />
			<ChevronDown aria-hidden="true" className="pointer-events-none absolute right-3 top-3 size-4 text-muted-foreground" />
		</div>
	);
}
