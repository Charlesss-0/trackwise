import { Card, CardHeader } from '@/components/ui/card'
import { type JSX } from 'react'

type Props = {
	title: string
	value: string
	icon: JSX.Element
}

export default function StatsCard({ title, value, icon }: Props): JSX.Element {
	return (
		<Card className="flex flex-col gap-2 p-6">
			<CardHeader>
				<div className="flex-col items-start gap-2">
					<h2 className="text-neutral">{title}</h2>

					<span className="text-xl font-bold text-base-content">${value}</span>
				</div>

				{icon}
			</CardHeader>
		</Card>
	)
}
