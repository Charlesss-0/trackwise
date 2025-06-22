'use client'

import { ArrowDownCircle, PiggyBank, Target, TrendingUp } from 'lucide-react'
import { Card, CardHeader } from '@/components/ui/card'

import { cn } from '@/utils/cn'
import { useExpenseStore } from '@/stores/expenses-store'
import { useGoalStore } from '@/stores/goals-store'
import { useIncomeStore } from '@/stores/income-store'
import { type JSX, useMemo } from 'react'

export default function QuickStats(): JSX.Element {
	const { income } = useIncomeStore()
	const { expenses } = useExpenseStore()
	const { goals } = useGoalStore()

	const totalIncome = income.reduce((acc, curr) => acc + curr.amount, 0).toFixed(2)
	const totalExpenses = expenses.reduce((acc, curr) => acc + curr.amount, 0).toFixed(2)
	const totalContributions = goals.reduce((acc, curr) => acc + curr.currentAmount, 0).toFixed(2)
	const availableMoney = Number(totalIncome) - Number(totalExpenses)

	const QUICK_STATS = useMemo(
		() =>
			[
				{
					name: 'Total Income',
					value: totalIncome,
					valueColor: 'text-green-primary',
					icon: <TrendingUp className="w-4 h-4 text-green-primary" />,
				},
				{
					name: 'Total Expenses',
					value: totalExpenses,
					valueColor: 'text-destructive',
					icon: <ArrowDownCircle className="w-4 h-4 text-destructive" />,
				},
				{
					name: 'Goal Contributions',
					value: totalContributions,
					valueColor: 'text-info',
					icon: <Target className="w-4 h-4 text-info" />,
				},
				{
					name: 'Available Money',
					value: availableMoney.toFixed(2),
					valueColor: 'text-info',
					icon: <PiggyBank className="w-4 h-4 text-info" />,
				},
			] as const,
		[totalIncome, totalExpenses, totalContributions, availableMoney]
	)

	return (
		<div className="grid w-full grid-cols-2 col-span-2 gap-4 md:col-span-4 md:gap-6 md:grid-cols-4">
			{QUICK_STATS.map(stat => (
				<Card key={stat.name} className="w-full">
					<CardHeader className="items-start gap-2">
						<span className="text-xs truncate md:text-sm text-neutral">{stat.name}</span>
						{stat.icon}
					</CardHeader>
					<p className={cn('text-sm md:text-2xl font-bold', stat.valueColor)}>${stat.value}</p>
				</Card>
			))}
		</div>
	)
}
