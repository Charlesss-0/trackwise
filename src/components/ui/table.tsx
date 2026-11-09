import type { ComponentProps } from "react";
import { twMerge } from "@/utils/tw-merge";
export function Table({ className, ...props }: ComponentProps<"table">) {
	return <table data-slot="table" className={twMerge("w-full text-left text-sm", className)} {...props} />;
}
export function TableHeader({ className, ...props }: ComponentProps<"thead">) {
	return <thead data-slot="table-header" className={twMerge("bg-muted/60 text-muted-foreground", className)} {...props} />;
}
export function TableBody(props: ComponentProps<"tbody">) {
	return <tbody data-slot="table-body" {...props} />;
}
export function TableRow({ className, ...props }: ComponentProps<"tr">) {
	return (
		<tr data-slot="table-row" className={twMerge("border-b border-border transition-colors last:border-0 hover:bg-muted/50", className)} {...props} />
	);
}
export function TableHead({ className, ...props }: ComponentProps<"th">) {
	return <th data-slot="table-head" className={twMerge("whitespace-nowrap px-5 py-3 text-xs font-medium", className)} {...props} />;
}
export function TableCell({ className, ...props }: ComponentProps<"td">) {
	return <td data-slot="table-cell" className={twMerge("px-5 py-4", className)} {...props} />;
}
