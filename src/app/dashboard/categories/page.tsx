"use client";

import { Pencil, Plus, Tags, Trash2 } from "lucide-react";
import { useState } from "react";
import { CategoryFormModal } from "@/components/categories/category-form-modal";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CategoryIcon } from "@/components/ui/category-icon";
import { DeleteButton } from "@/components/ui/confirm-dialog";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorNotice } from "@/components/ui/feedback";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { PageHeader } from "@/components/ui/page-header";
import { useCategories, useDeleteCategory } from "@/hooks/use-categories";
import type { Category } from "@/types/database";

export default function CategoriesPage() {
	const { data: categories, isLoading, error } = useCategories();
	const deleteCategory = useDeleteCategory();
	const [modalOpen, setModalOpen] = useState(false);
	const [categoryToEdit, setCategoryToEdit] = useState<Category | null>(null);

	if (isLoading)
		return (
			<div className="flex justify-center p-12">
				<LoadingSpinner size="lg" />
			</div>
		);

	return (
		<div className="space-y-7">
			<PageHeader title="Categories" description="Give every transaction a place. Keep your spending easy to understand.">
				<Button
					type="button"
					onClick={() => {
						setCategoryToEdit(null);
						setModalOpen(true);
					}}
					variant="default"
				>
					<Plus size={16} /> Add Category
				</Button>
			</PageHeader>

			<ErrorNotice error={error || deleteCategory.error} />

			<div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-4">
				{categories?.map((cat) => (
					<Card key={cat.id}>
						<div className="flex items-center justify-between gap-2 p-4">
							<div className="flex min-w-0 flex-wrap items-center gap-3">
								<div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-muted">
									<CategoryIcon name={cat.icon} color={cat.color} size={19} />
								</div>

								<span className="wrap-break-word font-medium">{cat.name}</span>

								{cat.is_default && <span className="inline-flex items-center rounded-md bg-muted px-2 py-1 text-xs font-medium">Default</span>}
							</div>

							<div className="flex shrink-0 gap-1">
								<Button
									type="button"
									variant="ghost"
									size="icon-sm"
									onClick={() => {
										setCategoryToEdit(cat);
										setModalOpen(true);
									}}
								>
									<Pencil size={14} />

									<span className="sr-only">Edit</span>
								</Button>

								<DeleteButton
									type="button"
									variant="ghost"
									size="icon-sm"
									className="text-destructive"
									message="Are you sure you want to delete this category?"
									onConfirm={() => {
										deleteCategory.mutate(cat.id);
									}}
									disabled={deleteCategory.isPending}
								>
									<Trash2 size={14} />

									<span className="sr-only">Delete</span>
								</DeleteButton>
							</div>
						</div>
					</Card>
				))}
				{categories?.length === 0 && (
					<Card className="col-span-full">
						<EmptyState
							icon={Tags}
							title="Make room for your categories"
							description="Create categories to organize your everyday income and expenses."
							actionLabel="Add category"
							onAction={() => {
								setCategoryToEdit(null);
								setModalOpen(true);
							}}
						/>
					</Card>
				)}
			</div>

			<CategoryFormModal isOpen={modalOpen} onClose={() => setModalOpen(false)} category={categoryToEdit} />
		</div>
	);
}
