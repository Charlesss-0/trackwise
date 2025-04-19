import { ArrowDownCircle, PiggyBank, Plus, Target, TrendingUp, Wallet } from 'lucide-react'
import { Card, CardHeader } from '@/components/ui/card'

import { Button } from '@/components/ui/button'
import { cn } from '@/utils/cn'

const QUICK_STATS = [
	{
		name: 'Total Income',
		value: 0,
		valueColor: 'text-green-primary',
		icon: <TrendingUp className="w-4 h-4 text-green-primary" />,
	},
	{
		name: 'Total Expenses',
		value: 0,
		valueColor: 'text-destructive',
		icon: <ArrowDownCircle className="w-4 h-4 text-destructive" />,
	},
	{
		name: 'Goal Contributions',
		value: 0,
		valueColor: 'text-info dark:text-info-dark',
		icon: <Target className="w-4 h-4 text-info dark:text-info-dark" />,
	},
	{
		name: 'Available Money',
		value: 0,
		valueColor: 'text-info dark:text-info-dark',
		icon: <PiggyBank className="w-4 h-4 text-info dark:text-info-dark" />,
	},
] as const

export default function Home(): React.ReactNode {
	const ACTION_BUTTONS = [
		{
			name: 'Add Income',
			icon: <Plus className="w-5 h-5" />,
			size: 'lg',
			variant: 'default',
			action: (): void => {
				// Add income action
			},
		},
		{
			name: 'Add Expense',
			icon: <Wallet className="w-5 h-5" />,
			size: 'lg',
			variant: 'destructive',
			action: (): void => {
				// Add expense action
			},
		},
	] as const

	return (
		<div className="max-w-[1600px] h-screen p-5 justify-items-center bg-base-100 dark:bg-base-100-dark">
			<header className="flex items-center justify-end w-full p-4">
				<div className="flex gap-4">
					{ACTION_BUTTONS.map(btn => (
						<Button key={btn.name} size={btn.size} variant={btn.variant}>
							{btn.icon}
							<span>{btn.name}</span>
						</Button>
					))}
				</div>
			</header>

			<main className="w-full p-4">
				<div className="grid grid-cols-1 gap-6 md:grid-cols-4">
					{QUICK_STATS.map(stat => (
						<Card key={stat.name}>
							<CardHeader>
								<span className="text-neutral">{stat.name}</span>
								{stat.icon}
							</CardHeader>
							<p className={cn('text-2xl font-bold', stat.valueColor)}>${stat.value}</p>
						</Card>
					))}
				</div>
			</main>
		</div>
	)
}
