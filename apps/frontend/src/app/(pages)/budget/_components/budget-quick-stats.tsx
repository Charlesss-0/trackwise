'use client'

import { Card, CardHeader } from '@/components/ui/card'
import { HandCoins, Target, TrendingDown, TrendingUp } from 'lucide-react'
import { useMemo, type JSX } from 'react'

export default function BudgetQuickStats(): JSX.Element {
	const QUICK_STATS = useMemo(
		() => [
			{
				name: 'Income',
				value: '$0',
				icon: <TrendingUp />,
			},
			{
				name: 'Total Allocated',
				value: '$0',
				icon: <Target />,
			},
			{
				name: 'Total Spent',
				value: '$0',
				icon: <TrendingDown />,
			},
			{
				name: 'Remaining Income',
				value: '$0',
				icon: <HandCoins />,
			},
		],
		[]
	)

	return (
		<div className="grid w-full grid-cols-2 col-span-2 gap-4 mt-5 md:gap-6 md:grid-cols-4">
			{QUICK_STATS.map(stat => (
				<Card key={stat.name} className="w-full">
					<CardHeader className="items-start gap-2">
						<span className="text-xs truncate md:text-sm text-neutral">{stat.name}</span>

						{stat.icon}
					</CardHeader>

					<p className="text-sm font-bold md:text-2xl">{stat.value}</p>
				</Card>
			))}
		</div>
	)
}
