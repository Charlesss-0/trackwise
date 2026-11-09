"use client";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import type { ComponentProps } from "react";
import { twMerge } from "@/utils/tw-merge";
import { buttonVariants } from "./button";
export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogTitle = DialogPrimitive.Title;
export const DialogDescription = DialogPrimitive.Description;
export function DialogContent({ className, children, ...props }: ComponentProps<typeof DialogPrimitive.Content>) {
	return (
		<DialogPrimitive.Portal>
			<DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-foreground/30 backdrop-blur-[3px] motion-safe:data-[state=open]:animate-fade-in" />
			<DialogPrimitive.Content
				data-slot="dialog-content"
				className={twMerge(
					"fixed left-1/2 top-1/2 z-50 max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-2xl border border-border bg-card p-5 text-foreground shadow-xl outline-none sm:p-7",
					className,
				)}
				{...props}
			>
				{children}
				<DialogPrimitive.Close
					className={twMerge(buttonVariants({ variant: "ghost", size: "icon-sm" }), "absolute right-3 top-3")}
					aria-label="Close dialog"
				>
					<X />
				</DialogPrimitive.Close>
			</DialogPrimitive.Content>
		</DialogPrimitive.Portal>
	);
}
