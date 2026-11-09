import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";
import { twMerge } from "@/utils/tw-merge";

export const buttonVariants = cva(
	"inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold transition-colors disabled:pointer-events-none disabled:opacity-45 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
	{
		variants: {
			variant: {
				default: "bg-primary text-primary-foreground hover:bg-primary/90 border border-transparent",
				outline: "border border-input bg-card hover:bg-accent hover:text-accent-foreground",
				secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/75 border border-transparent",
				ghost: "hover:bg-accent hover:text-accent-foreground border border-transparent",
				destructive: "bg-destructive/10 text-destructive hover:bg-destructive/20 border border-destructive/15",
				link: "text-primary underline-offset-4 hover:underline",
			},
			size: { default: "h-10 px-4 py-2", sm: "h-9 px-3", lg: "h-12 px-6", icon: "size-10", "icon-sm": "size-9" },
		},
		defaultVariants: { variant: "default", size: "default" },
	},
);
export function Button({
	className,
	variant,
	size,
	asChild = false,
	...props
}: ComponentProps<"button"> & VariantProps<typeof buttonVariants> & { asChild?: boolean }) {
	const Comp = asChild ? Slot : "button";
	return <Comp data-slot="button" className={twMerge(buttonVariants({ variant, size, className }))} {...props} />;
}
