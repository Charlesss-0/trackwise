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

export default function Budget(): JSX.Element {
	const { categories } = useBudgetStore()
	const [modalState, setModalState] = useState<boolean>(false)

	return (
		<div>
			<PageHeader title="Budget" description="Allocate your income across different categories" />

			<div className="flex justify-end">
				<Button className="self-end" onClick={() => setModalState(true)}>
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
					categories.map(category => <BudgetCardItem key={category.id} budgetCategory={category} />)
				) : (
					<div className="flex items-center justify-center h-64">
						<span className="font-medium text-neutral">No budget categories set yet.</span>
					</div>
				)}
			</div>

			<AddBudgetCategoryDialog open={modalState} onOpenChange={setModalState} />
		</div>
	)
}
