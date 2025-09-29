'use client'

import { Calendar, CircleCheckBig, DollarSign } from 'lucide-react'
import { useMemo, type JSX } from 'react'
import { Card, CardHeader } from '@/components/ui/card'

export default function FixedExpensesQuickStats(): JSX.Element {
	const STATS_ITEMS = useMemo(
		() => [
			{
				title: 'Total Monthly',
				value: '0.00',
				icon: <DollarSign className="text-base-content" />,
			},
			{
				title: 'Paid This Month',
				value: '0.00',
				icon: <CircleCheckBig className="text-base-content" />,
			},
			{
				title: 'Pending Payments',
				value: '0.00',
				icon: <Calendar className="text-base-content" />,
			},
		],
		[]
	)

	return (
		<div className="grid w-full grid-cols-2 col-span-2 gap-4 mt-5 md:gap-6 md:grid-cols-3">
			{STATS_ITEMS.map(stat => (
				<Card key={stat.title} className="w-full">
					<CardHeader className="items-start gap-2">
						<span className="text-xs truncate md:text-sm text-neutral">{stat.title}</span>

						{stat.icon}
					</CardHeader>

					<p className="text-sm font-bold md:text-2xl">{stat.value}</p>
				</Card>
			))}
		</div>
	)
}
