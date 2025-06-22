'use client'

import { Button } from '@/components/ui/button'
import QuickStats from '@/pages/dashboard/_components/quick-stats'
import { Plus, Wallet } from 'lucide-react'
import { useMemo, useState, type JSX } from 'react'
import AddIncome from '@/pages/dashboard/_components/add-income-dialog'
import AddExpense from '@/pages/dashboard/_components/add-expense-dialog'
import PageHeader from '@/components/shared/page-header'

export default function Dashboard(): JSX.Element {
	const [addIncomeOpen, setAddIncomeOpen] = useState<boolean>(false)
	const [addExpenseOpen, setAddExpenseOpen] = useState<boolean>(false)

	const ACTION_BUTTONS = useMemo(
		() =>
			[
				{
					name: 'Add Income',
					icon: <Plus className="w-5 h-5" />,
					size: 'lg',
					variant: 'secondary',
					action: (): void => setAddIncomeOpen(true),
				},
				{
					name: 'Add Expense',
					icon: <Wallet className="w-5 h-5" />,
					size: 'lg',
					variant: 'destructive',
					action: (): void => setAddExpenseOpen(true),
				},
			] as const,
		[]
	)

	return (
		<>
			<PageHeader
				title="Welcome back!"
				description="Here's your financial overview for this month"
			/>

			<div className="flex justify-between gap-4 md:justify-end">
				{ACTION_BUTTONS.map(btn => (
					<Button
						key={btn.name}
						size={btn.size}
						variant={btn.variant}
						onClick={btn.action}
						className="px-2 text-xs"
					>
						{btn.icon}
						<span>{btn.name}</span>
					</Button>
				))}
			</div>

			<QuickStats />

			<AddIncome open={addIncomeOpen} onOpenChange={setAddIncomeOpen} />
			<AddExpense open={addExpenseOpen} onOpenChange={setAddExpenseOpen} />
		</>
	)
}
