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
			<header className="flex items-center justify-end w-full gap-6 p-4">
				<div className="flex gap-4">
					{ACTION_BUTTONS.map(btn => (
						<Button key={btn.name} size={btn.size} variant={btn.variant} onClick={btn.action}>
							{btn.icon}
							<span>{btn.name}</span>
						</Button>
					))}
				</div>
				<ThemeToggle />
			</header>
			<AddIncome open={addIncomeOpen} onOpenChange={setAddIncomeOpen} />
			<AddExpense open={addExpenseOpen} onOpenChange={setAddExpenseOpen} />
		</>
	)
}
