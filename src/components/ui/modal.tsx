"use client";
import { useRef } from "react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "./dialog";

type ModalProps = { isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode };
export function Modal({ isOpen, onClose, title, children }: ModalProps) {
	const returnFocus = useRef<HTMLElement | null>(null);
	return (
		<Dialog
			open={isOpen}
			onOpenChange={(open) => {
				if (!open) onClose();
			}}
		>
			<DialogContent
				onOpenAutoFocus={() => {
					returnFocus.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
				}}
				onCloseAutoFocus={(event) => {
					event.preventDefault();
					returnFocus.current?.focus();
				}}
			>
				<div className="mb-6 pr-8">
					<DialogTitle className="font-display text-xl font-semibold tracking-tight">{title}</DialogTitle>
					<DialogDescription className="mt-1 text-sm text-muted-foreground">Keep your financial picture up to date.</DialogDescription>
				</div>
				{children}
			</DialogContent>
		</Dialog>
	);
}
