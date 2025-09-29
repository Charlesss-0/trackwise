'use client'

import PageHeader from '@/components/shared/page-header'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { useState, type JSX } from 'react'
import BudgetQuickStats from '@/pages/budget/_components/budget-quick-stats'
import AddBudgetCategoryDialog from '@/pages/budget/_components/add-budget-category-dialog'
import { useBudgetStore } from '@/stores/budget-store'
import BudgetCardItem from './_components/budget-card-item'
import { cn } from '@/utils/cn'
import UpdateBudgetCategoryDialog from './_components/update-budget-category-dialog'

type Modal = {
	state: 'add' | 'update' | null
	id: string | null
}

export default function Budget(): JSX.Element {
	const { budgetCategory: categories } = useBudgetStore()
	const [modal, setModal] = useState<Modal>({
		state: null,
		id: null,
	})

	const openModal = (state: typeof modal.state, id?: string): void => {
		setModal({ state, id: id || null })
	}

	const closeModal = (): void => {
		setModal({ state: null, id: null })
	}

	return (
		<div>
			<PageHeader title="Budget" description="Allocate your income across different categories" />

			<div className="flex justify-end">
				<Button className="self-end" onClick={() => openModal('add')}>
					<Plus className="w-5 h-5" />

					<span>Add Category</span>
				</Button>
			</div>

			<BudgetQuickStats />

			<div
				className={cn(
					'grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-4 my-6',
					categories.length > 0 ? '' : 'w-full flex justify-center'
				)}
			>
				{categories.length > 0 ? (
					categories.map(category => (
						<BudgetCardItem
							key={category.id}
							budgetCategory={category}
							onEdit={() => openModal('update', category.id)}
						/>
					))
				) : (
					<div className="flex items-center justify-center h-64">
						<span className="font-medium text-neutral">No budget categories set yet.</span>
					</div>
				)}
			</div>

			<AddBudgetCategoryDialog
				open={modal.state === 'add'}
				onOpenChange={isOpen => (isOpen ? openModal('add') : closeModal())}
			/>

			<UpdateBudgetCategoryDialog
				id={modal.id as string}
				open={modal.state === 'update'}
				onOpenChange={closeModal}
			/>
		</div>
	)
}
