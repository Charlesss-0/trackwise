'use client'
import { useGoalStore } from '@/stores/goals-store'
import { CircleDollarSign, DollarSign, Target } from 'lucide-react'
import { useMemo, type JSX } from 'react'
import { GoalsQuickStatsItem } from '@/pages/goals/_components/goals-quick-stats-item'

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
		[]
	)

	return (
		<div className="grid grid-cols-2 gap-4 md:grid-cols-3">
			{STATS_ITEMS.map((item, index) => (
				<GoalsQuickStatsItem key={index} {...item} />
			))}
		</div>
	)
}
