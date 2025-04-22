'use client'

import { ArrowDownCircle, PiggyBank, Target, TrendingUp } from 'lucide-react'
import { Card, CardHeader } from '@/components/ui/card'

import { cn } from '@/utils/cn'
import { useMemo } from 'react'
import { useTransactionsStore } from '@/stores/transactions-store'

export default function QuickStats(): React.ReactNode {
	const { transactions } = useTransactionsStore()

	const income = transactions.filter((transaction: Transaction) => transaction.isExpense === false)

	const QUICK_STATS = useMemo(
		() =>
			[
				{
					name: 'Total Income',
					value: income.reduce((total, income) => total + income.amount, 0),
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
			] as const,
		[income]
	)

	return (
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
	)
}
