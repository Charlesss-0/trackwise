"use client";

import { Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { CategoryFormModal } from "@/components/categories/category-form-modal";
import { CategoryIcon } from "@/components/ui/category-icon";
import { useCategories, useDeleteCategory } from "@/hooks/use-categories";
import type { Category } from "@/types/database";

export default function CategoriesPage() {
	const { data: categories, isLoading } = useCategories();
	const deleteCategory = useDeleteCategory();
	const [modalOpen, setModalOpen] = useState(false);
	const [categoryToEdit, setCategoryToEdit] = useState<Category | null>(null);

	if (isLoading)
		return (
			<div className="flex justify-center p-12">
				<span className="loading loading-spinner loading-lg"></span>
			</div>
		);

	return (
		<div className="space-y-6">
			<div className="flex justify-between items-center">
				<h1 className="text-2xl font-bold">Categories</h1>
				<button
					type="button"
					onClick={() => {
						setCategoryToEdit(null);
						setModalOpen(true);
					}}
					className="btn btn-primary btn-sm"
				>
					<Plus size={16} /> Add Category
				</button>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
				{categories?.map((cat) => (
					<div key={cat.id} className="card bg-base-200 border border-base-300">
						<div className="card-body p-4 flex flex-row items-center justify-between">
							<div className="flex items-center gap-3">
								<CategoryIcon name={cat.icon} color={cat.color} size={20} />

								<span className="font-medium">{cat.name}</span>

								{cat.is_default && <span className="badge badge-sm">Default</span>}
							</div>

							<div className="flex gap-2">
								<button
									type="button"
									className="btn btn-ghost btn-xs"
									onClick={() => {
										setCategoryToEdit(cat);
										setModalOpen(true);
									}}
								>
									<Pencil size={14} />
								</button>

								<button
									type="button"
									className="btn btn-ghost btn-xs text-error"
									onClick={() => {
										if (confirm("Are you sure you want to delete this category?")) {
											deleteCategory.mutate(cat.id);
										}
									}}
									disabled={deleteCategory.isPending}
								>
									<Trash2 size={14} />
								</button>
							</div>
						</div>
					</div>
				))}
			</div>

			<CategoryFormModal isOpen={modalOpen} onClose={() => setModalOpen(false)} category={categoryToEdit} />
		</div>
	);
}
