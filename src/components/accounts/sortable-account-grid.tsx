"use client";

import { closestCenter, DndContext, type DragEndEvent, KeyboardSensor, MouseSensor, TouchSensor, useSensor, useSensors } from "@dnd-kit/core";
import { restrictToWindowEdges } from "@dnd-kit/modifiers";
import { arrayMove, rectSortingStrategy, SortableContext, sortableKeyboardCoordinates, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import { type ReactNode, useId, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { twMerge } from "@/utils/tw-merge";

type SortableAccount = { id: string; name: string };
type OrderChange = { expectedIds: string[]; orderedIds: string[] };

export function SortableAccountGrid({
	accounts,
	onReorder,
	disabled,
	children,
}: {
	accounts: SortableAccount[];
	onReorder: (change: OrderChange) => void;
	disabled: boolean;
	children: ReactNode;
}) {
	const id = useId();
	const dragOrder = useRef<string[]>([]);
	const sensors = useSensors(
		useSensor(MouseSensor, { activationConstraint: { distance: 6 } }),
		useSensor(TouchSensor, { activationConstraint: { delay: 220, tolerance: 6 } }),
		useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
	);
	const name = (accountId: string | number) => accounts.find((account) => account.id === accountId)?.name ?? "Account";
	const position = (accountId: string | number) => dragOrder.current.indexOf(String(accountId)) + 1;

	function handleDragEnd({ active, over }: DragEndEvent) {
		if (disabled || !over || active.id === over.id) return;
		const from = dragOrder.current.indexOf(String(active.id));
		const to = dragOrder.current.indexOf(String(over.id));
		if (from < 0 || to < 0) return;
		onReorder({ expectedIds: dragOrder.current, orderedIds: arrayMove(dragOrder.current, from, to) });
	}

	return (
		<DndContext
			id={id}
			sensors={sensors}
			collisionDetection={closestCenter}
			modifiers={[restrictToWindowEdges]}
			onDragStart={() => {
				dragOrder.current = accounts.map((account) => account.id);
			}}
			onDragEnd={handleDragEnd}
			accessibility={{
				screenReaderInstructions: {
					draggable:
						"To reorder an account, press Space or Enter on its drag handle. Use the arrow keys to move between rows and columns. Press Space or Enter to drop, or Escape to cancel.",
				},
				announcements: {
					onDragStart: ({ active }) => `Picked up ${name(active.id)}, position ${position(active.id)} of ${accounts.length}.`,
					onDragOver: ({ active, over }) =>
						over ? `${name(active.id)}, position ${position(over.id)} of ${accounts.length}.` : "Outside a drop position.",
					onDragEnd: ({ active, over }) =>
						over ? `Placed ${name(active.id)} at position ${position(over.id)} of ${accounts.length}.` : `Cancelled moving ${name(active.id)}.`,
					onDragCancel: ({ active }) => `Cancelled moving ${name(active.id)}. Order unchanged.`,
				},
			}}
		>
			<SortableContext items={accounts.map((account) => account.id)} strategy={rectSortingStrategy} disabled={disabled}>
				<div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-4">{children}</div>
			</SortableContext>
		</DndContext>
	);
}

export function SortableAccountCard({
	account,
	disabled,
	children,
}: {
	account: SortableAccount;
	disabled: boolean;
	children: (handle: ReactNode) => ReactNode;
}) {
	const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isDragging, isOver } = useSortable({
		id: account.id,
		disabled,
	});
	const handle = (
		<Button
			type="button"
			ref={setActivatorNodeRef}
			variant="ghost"
			size="icon-sm"
			className={twMerge(
				"relative z-20 shrink-0 touch-manipulation cursor-grab text-muted-foreground hover:text-foreground active:cursor-grabbing",
				isDragging && "cursor-grabbing",
				disabled && "cursor-wait opacity-50",
			)}
			{...attributes}
			{...listeners}
			aria-label={`Reorder ${account.name}`}
			aria-disabled={disabled}
			title="Drag to reorder · Space to move with keyboard"
		>
			<GripVertical aria-hidden="true" />
		</Button>
	);
	return (
		<Card
			ref={setNodeRef}
			style={{ transform: CSS.Translate.toString(transform), transition, zIndex: isDragging ? 30 : undefined }}
			className={twMerge(
				"relative overflow-hidden transition-colors hover:border-primary/40 motion-reduce:transition-none",
				isDragging && "border-primary/50 shadow-lg ring-1 ring-primary/20",
				isOver && !isDragging && "border-primary/40",
			)}
		>
			{children(handle)}
		</Card>
	);
}
