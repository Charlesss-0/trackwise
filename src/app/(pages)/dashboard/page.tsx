'use client'

import { Button } from '@/components/ui/button'
import QuickStats from '@/pages/dashboard/_components/quick-stats'
import { Plus, Wallet } from 'lucide-react'
import { useState, type JSX } from 'react'
import AddIncome from '@/pages/dashboard/_components/add-income-dialog'
import AddExpense from '@/pages/dashboard/_components/add-expense-dialog'
import PageHeader from '@/components/shared/page-header'

export default function Dashboard(): JSX.Element {
	const [addIncomeOpen, setAddIncomeOpen] = useState<boolean>(false)
	const [addExpenseOpen, setAddExpenseOpen] = useState<boolean>(false)

	return (
		<>
			<PageHeader
				title="Welcome back!"
				description="Here's your financial overview for this month"
			/>

			<div className="flex justify-between gap-4 md:justify-end">
				<Button size="lg" className="px-2" onClick={() => setAddIncomeOpen(true)}>
					<Plus className="w-5 h-5" />
					<span>Add Income</span>
				</Button>

				<Button
					size="lg"
					variant="destructive"
					className="px-2"
					onClick={() => setAddExpenseOpen(true)}
				>
					<Wallet className="w-5 h-5" />
					<span>Add Expense</span>
				</Button>
			</div>

			<QuickStats />

			<AddIncome open={addIncomeOpen} onOpenChange={setAddIncomeOpen} />
			<AddExpense open={addExpenseOpen} onOpenChange={setAddExpenseOpen} />
		</>
	)
}
