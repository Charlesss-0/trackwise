'use client'

import { Plus, Wallet } from 'lucide-react'

import AddExpense from '@/components/add-expense-dialog'
import AddIncome from '@/components/add-income-dialog'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/theme-toggle'
import { type JSX, useState } from 'react'

export default function Header(): JSX.Element {
	const [addIncomeOpen, setAddIncomeOpen] = useState<boolean>(false)
	const [addExpenseOpen, setAddExpenseOpen] = useState<boolean>(false)
	const currentDate = (): string => {
		const date = new Date()
		const formattedDate = date.toLocaleDateString('en-US', {
			day: 'numeric',
			month: 'long',
			year: 'numeric',
		})

		return formattedDate
	}

	const ACTION_BUTTONS = [
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
	] as const

	return (
		<>
			<header className="flex flex-col items-center justify-between w-full gap-6 p-4">
				<div className="flex flex-col w-full gap-4">
					<div className="flex items-center justify-between">
						<h1 className="text-sm font-bold md:text-2xl text-base-content">{currentDate()}</h1>
						<ThemeToggle />
					</div>
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
				</div>
			</header>

			<AddIncome open={addIncomeOpen} onOpenChange={setAddIncomeOpen} />
			<AddExpense open={addExpenseOpen} onOpenChange={setAddExpenseOpen} />
		</>
	)
}
