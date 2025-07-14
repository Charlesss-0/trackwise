'use client'
import { useGoalStore } from '@/stores/goals-store'
import { CircleDollarSign, DollarSign, Target } from 'lucide-react'
import { useMemo, type JSX } from 'react'
import { Card, CardHeader } from '@/components/ui/card'

export default function GoalsQuickStats(): JSX.Element {
	const { goals } = useGoalStore()

	const STATS_ITEMS = useMemo(
		() =>
			[
				{
					title: 'Total Goals',
					value: goals.length,
					icon: <Target />,
				},
				{
					title: 'Total Amount',
					value: goals.reduce((acc, goal) => acc + goal.targetAmount, 0),
					icon: <CircleDollarSign />,
				},
				{
					title: 'Progress',
					value: goals.reduce((acc, goal) => acc + goal.currentAmount, 0),
					icon: <DollarSign />,
				},
			] as const,
		[goals]
	)

	return (
		<div className="grid w-full grid-cols-2 col-span-2 gap-4 md:gap-6 md:grid-cols-3">
			{STATS_ITEMS.map(stat => (
				<Card key={stat.title} className="w-full">
					<CardHeader className="items-start gap-2">
						<span className="text-xs truncate md:text-sm text-neutral">{stat.title}</span>

						{stat.icon}
					</CardHeader>

					<p className="text-sm font-bold md:text-2xl">${stat.value}</p>
				</Card>
			))}
		</div>
	)
}
