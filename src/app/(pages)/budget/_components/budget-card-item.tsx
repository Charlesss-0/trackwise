'use client'

import { Card, CardHeader } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { type JSX } from 'react'

export default function BudgetCardItem({
	budgetCategory,
}: {
	budgetCategory: BudgetCategory
}): JSX.Element {
	return (
		<Card onClick={() => alert('Clicked')} className="bg-base-100 hover:cursor-pointer">
			<CardHeader className="flex justify-between">
				<span className="text-sm font-bold text-base-content">{budgetCategory.name}</span>

				<span className="text-xs text-neutral">Budgeted: ${budgetCategory.budgetAmount}</span>
			</CardHeader>

			<div className="flex flex-col gap-2">
				<Progress
					value={(Number(budgetCategory.spentAmount) / Number(budgetCategory.budgetAmount)) * 100}
					className="h-2"
				/>

				<div className="flex justify-between text-xs text-neutral">
					<span className="font-medium">Spent: ${budgetCategory.spentAmount}</span>

					<span className="font-medium">
						Remaining: ${Number(budgetCategory.budgetAmount) - Number(budgetCategory.spentAmount)}
					</span>
				</div>
			</div>
		</Card>
	)
}
