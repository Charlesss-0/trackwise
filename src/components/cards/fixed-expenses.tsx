'use client'

import { Calendar, Plus } from 'lucide-react'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'

import AddFixedExpense from '@/components/dialogs/add-fixed-expense'
import { Button } from '@/components/ui/button'
import { Progress } from '../ui/progress'
import { useFixedExpenseStore } from '@/stores/fixed-expenses-store'
import { useState } from 'react'

export default function FixedExpenses(): React.ReactNode {
	const { fixedExpenses } = useFixedExpenseStore()
	const [addFixedExpenseOpen, setAddFixedExpenseOpen] = useState<boolean>(false)

	return (
		<>
			<Card className="relative h-max">
				<h2 className="text-lg font-medium text-neutral">Fixed Expenses</h2>
				{fixedExpenses.length > 0 ? (
					fixedExpenses.map(fixedExpense => (
						<Card key={fixedExpense.id} className="rounded-md bg-base-100 dark:bg-base-100-dark">
							<CardHeader className="flex justify-between">
								<div className="flex flex-col gap-1">
									<span className="text-base-content dark:text-base-content-dark">
										{fixedExpense.name}
									</span>
									<span className="text-sm font-medium text-neutral">{fixedExpense.category}</span>
								</div>
								<div className="self-start">
									<span className="flex items-center gap-2 text-sm font-medium text-neutral">
										<Calendar size={16} />
										{new Date(fixedExpense.dueDate).toLocaleDateString()}
									</span>
								</div>
							</CardHeader>
							<CardContent className="flex-col gap-2">
								<div className="flex justify-between">
									<span>Progress</span>
									<span>
										${fixedExpense.currentAmount ? fixedExpense.currentAmount.toFixed(2) : '0.00'} /
										${fixedExpense.targetAmount.toFixed(2)}
									</span>
								</div>
								<Progress value={(fixedExpense.currentAmount / fixedExpense.targetAmount) * 100} />
							</CardContent>
							<CardFooter>
								<Button variant="secondary" className="w-full rounded-md">
									Add Payment
								</Button>
							</CardFooter>
						</Card>
					))
				) : (
					<div className="flex flex-col items-center justify-center h-full mb-6">
						<p className="text-sm font-medium text-neutral">No fixed expenses set yet.</p>
						<Button variant="outline" className="mt-4" onClick={() => setAddFixedExpenseOpen(true)}>
							Add Fixed Expense
						</Button>
					</div>
				)}
				{fixedExpenses.length > 0 && (
					<Button
						variant="ghost"
						size="icon"
						className="absolute right-4 top-4 hover:bg-base-300 dark:hover:bg-base-300-dark"
						onClick={() => setAddFixedExpenseOpen(true)}
					>
						<Plus size={16} />
					</Button>
				)}
			</Card>
			<AddFixedExpense open={addFixedExpenseOpen} onOpenChange={setAddFixedExpenseOpen} />
		</>
	)
}
