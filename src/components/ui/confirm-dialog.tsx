"use client";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import { Trash2 } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";
import { Button } from "./button";
import { LoadingSpinner } from "./loading-spinner";

function ConfirmationContent({
	title,
	message,
	onConfirm,
	confirmLabel = "Delete",
	isLoading = false,
}: {
	title: string;
	message: string;
	onConfirm: () => void;
	confirmLabel?: string;
	isLoading?: boolean;
}) {
	return (
		<AlertDialog.Portal>
			<AlertDialog.Overlay className="fixed inset-0 z-[60] bg-foreground/30 backdrop-blur-[3px]" />
			<AlertDialog.Content className="fixed left-1/2 top-1/2 z-[60] w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-border bg-card p-6 shadow-xl">
				<div className="mb-4 flex size-10 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
					<Trash2 size={18} />
				</div>
				<AlertDialog.Title className="font-display text-lg font-semibold">{title}</AlertDialog.Title>
				<AlertDialog.Description className="mt-2 text-sm leading-relaxed text-muted-foreground">{message}</AlertDialog.Description>
				<div className="form-actions mt-6">
					<AlertDialog.Cancel asChild>
						<Button type="button" variant="outline" disabled={isLoading}>
							Cancel
						</Button>
					</AlertDialog.Cancel>
					<AlertDialog.Action asChild>
						<Button type="button" variant="destructive" onClick={onConfirm} disabled={isLoading}>
							{isLoading && <LoadingSpinner size="sm" />}
							{confirmLabel}
						</Button>
					</AlertDialog.Action>
				</div>
			</AlertDialog.Content>
		</AlertDialog.Portal>
	);
}
export function ConfirmDialog({
	isOpen,
	onClose,
	...props
}: {
	isOpen: boolean;
	onClose: () => void;
	onConfirm: () => void;
	title: string;
	message: string;
	confirmLabel?: string;
	isLoading?: boolean;
}) {
	return (
		<AlertDialog.Root
			open={isOpen}
			onOpenChange={(open) => {
				if (!open) onClose();
			}}
		>
			<ConfirmationContent {...props} />
		</AlertDialog.Root>
	);
}
export function DeleteButton({
	onConfirm,
	message,
	children,
	...props
}: Omit<ComponentProps<typeof Button>, "onClick"> & { onConfirm: () => void; message: string; children: ReactNode }) {
	return (
		<AlertDialog.Root>
			<AlertDialog.Trigger asChild>
				<Button type="button" {...props}>
					{children}
				</Button>
			</AlertDialog.Trigger>
			<ConfirmationContent title="Confirm deletion" message={message} onConfirm={onConfirm} />
		</AlertDialog.Root>
	);
}
