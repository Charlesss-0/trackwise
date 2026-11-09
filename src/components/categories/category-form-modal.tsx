"use client";

import { type SubmitEvent, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { DeleteButton } from "@/components/ui/confirm-dialog";
import { ErrorNotice } from "@/components/ui/feedback";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Modal } from "@/components/ui/modal";
import { useCreateCategory, useDeleteCategory, useUpdateCategory } from "@/hooks/use-categories";
import type { Category } from "@/types/database";

type CategoryFormModalProps = {
	isOpen: boolean;
	onClose: () => void;
	category?: Category | null;
};

export function CategoryFormModal({ isOpen, onClose, category }: CategoryFormModalProps) {
	const isEditing = !!category;
	const [name, setName] = useState(category?.name ?? "");
	const [icon, setIcon] = useState(category?.icon ?? "tag");
	const [color, setColor] = useState(category?.color ?? "#3B82F6");

	useEffect(() => {
		if (isOpen) {
			setName(category?.name ?? "");
			setIcon(category?.icon ?? "tag");
			setColor(category?.color ?? "#3B82F6");
		}
	}, [isOpen, category]);

	const createCategory = useCreateCategory();
	const updateCategory = useUpdateCategory();
	const deleteCategory = useDeleteCategory();
	const isPending = createCategory.isPending || updateCategory.isPending || deleteCategory.isPending;

	const handleSubmit = async (e: SubmitEvent) => {
		e.preventDefault();
		if (!name.trim()) return;

		if (isEditing && category) {
			await updateCategory.mutateAsync({
				id: category.id,
				name: name.trim(),
				icon,
				color,
			});
		} else {
			await createCategory.mutateAsync({
				name: name.trim(),
				icon,
				color,
				is_default: false,
			});
		}

		handleClose();
	};

	const handleClose = () => {
		setName("");
		setIcon("tag");
		setColor("#3B82F6");
		onClose();
	};

	return (
		<Modal isOpen={isOpen} onClose={handleClose} title={isEditing ? "Edit Category" : "Add Category"}>
			<form
				onSubmit={(event) => {
					void handleSubmit(event).catch(() => {});
				}}
				className="flex flex-col gap-4"
			>
				<div className="field">
					<Label htmlFor="category-name">
						<span className="text-sm">Category Name</span>
					</Label>
					<Input
						id="category-name"
						type="text"
						className="w-full"
						placeholder="e.g. Pet Supplies"
						value={name}
						onChange={(e) => setName(e.target.value)}
						required
					/>
				</div>

				<div className="field">
					<Label htmlFor="category-color">
						<span className="text-sm">Color</span>
					</Label>
					<Input id="category-color" type="color" className="w-full h-12 p-1" value={color} onChange={(e) => setColor(e.target.value)} />
				</div>

				<ErrorNotice error={createCategory.error || updateCategory.error || deleteCategory.error} />
				<div className="form-actions">
					{isEditing && (
						<DeleteButton
							type="button"
							variant="destructive"
							size="default"
							className="mr-auto"
							message="Are you sure you want to delete this category?"
							onConfirm={() => {
								deleteCategory.mutate(category.id);
								handleClose();
							}}
							disabled={isPending}
						>
							Delete
						</DeleteButton>
					)}
					<Button type="button" variant="ghost" size="default" onClick={handleClose} disabled={isPending}>
						Cancel
					</Button>
					<Button type="submit" variant="default" size="default" disabled={isPending || !name.trim()}>
						{isPending && <LoadingSpinner size="sm" />}
						{isEditing ? "Save Changes" : "Add Category"}
					</Button>
				</div>
			</form>
		</Modal>
	);
}
