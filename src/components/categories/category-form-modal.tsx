"use client";

import { type SubmitEvent, useEffect, useState } from "react";
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
			<form onSubmit={handleSubmit} className="flex flex-col gap-4">
				<div className="form-control">
					<label className="label" htmlFor="category-name">
						<span className="label-text">Category Name</span>
					</label>
					<input
						id="category-name"
						type="text"
						className="input input-bordered w-full"
						placeholder="e.g. Pet Supplies"
						value={name}
						onChange={(e) => setName(e.target.value)}
						required
					/>
				</div>

				<div className="form-control">
					<label className="label" htmlFor="category-color">
						<span className="label-text">Color</span>
					</label>
					<input
						id="category-color"
						type="color"
						className="input input-bordered w-full h-12 p-1"
						value={color}
						onChange={(e) => setColor(e.target.value)}
					/>
				</div>

				<div className="modal-action">
					{isEditing && (
						<button
							type="button"
							className="btn btn-error mr-auto"
							onClick={() => {
								if (confirm("Are you sure you want to delete this category?")) {
									deleteCategory.mutate(category.id);
									handleClose();
								}
							}}
							disabled={isPending}
						>
							Delete
						</button>
					)}
					<button type="button" className="btn btn-ghost" onClick={handleClose} disabled={isPending}>
						Cancel
					</button>
					<button type="submit" className="btn btn-primary" disabled={isPending || !name.trim()}>
						{isPending && <span className="loading loading-spinner loading-sm" />}
						{isEditing ? "Save Changes" : "Add Category"}
					</button>
				</div>
			</form>
		</Modal>
	);
}
