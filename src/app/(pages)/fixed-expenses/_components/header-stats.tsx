'use client'

import { Calendar, CircleCheckBig, DollarSign } from 'lucide-react'
import { useMemo, type JSX } from 'react'
import StatsCard from './stats-card'

export default function HeaderStats(): JSX.Element {
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
		<div className="grid grid-cols-2 gap-4 md:grid-cols-3">
			{STATS_ITEMS.map((item, index) => (
				<StatsCard key={index} {...item} />
			))}
		</div>
	)
}
