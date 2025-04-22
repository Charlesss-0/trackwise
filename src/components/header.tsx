'use client'

import { Plus, Wallet } from 'lucide-react'

import AddExpense from '@/components/dialogs/add-expense'
import AddIncome from '@/components/dialogs/add-income'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/theme-toggle'
import { useState } from 'react'

export default function Header(): React.ReactNode {
	const [addIncomeOpen, setAddIncomeOpen] = useState<boolean>(false)
	const [addExpenseOpen, setAddExpenseOpen] = useState<boolean>(false)
	const currentDate = () => {
		const date = new Date()
		const formattedDate = date.toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
		})

		return formattedDate
	}

	const ACTION_BUTTONS = [
		{
			name: 'Add Income',
			icon: <Plus className="w-5 h-5" />,
			size: 'lg',
			variant: 'default',
			action: (): void => setAddIncomeOpen(true),
		},
		{
			name: 'Add Expense',
			icon: <Wallet className="w-5 h-5" />,
			size: 'lg',
			variant: 'destructive',
			action: (): void => setAddExpenseOpen(true),
		},
	] as const

	return (
		<>
			<header className="flex items-center justify-between w-full gap-6 p-4">
				<h1 className="text-2xl font-bold text-base-content dark:text-base-content-dark">
					{currentDate()}
				</h1>
				<div className="flex gap-4">
					{ACTION_BUTTONS.map(btn => (
						<Button key={btn.name} size={btn.size} variant={btn.variant} onClick={btn.action}>
							{btn.icon}
							<span>{btn.name}</span>
						</Button>
					))}
					<ThemeToggle />
				</div>
			</header>
			<AddIncome open={addIncomeOpen} onOpenChange={setAddIncomeOpen} />
			<AddExpense open={addExpenseOpen} onOpenChange={setAddExpenseOpen} />
		</>
	)
}
