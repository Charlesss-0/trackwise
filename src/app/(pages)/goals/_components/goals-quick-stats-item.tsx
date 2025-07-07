import { Card, CardHeader } from '@/components/ui/card'
import { type JSX } from 'react'

export function GoalsQuickStatsItem({
	title,
	value,
	icon,
}: {
	title: string
	value: number
	icon: JSX.Element
}): JSX.Element {
	return (
		<Card className="flex gap-2 p-6">
			<CardHeader>
				<div className="flex-col items-start gap-2">
					<h2 className='className="text-neutral"'>{title}</h2>

					<span className="text-xl font-bold text-base-content">
						{title === 'Total Goals' ? value : `$${value.toFixed(2)}`}
					</span>
				</div>

				{icon}
			</CardHeader>
		</Card>
	)
}
