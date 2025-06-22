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
			<CardHeader className="">
				<div className="flex-col gap-2 items-start">
					<h2 className="text-neutral">{title}</h2>
					<p className="text-xl font-bold text-base-content">${value}</p>
				</div>
				{icon}
			</CardHeader>
		</Card>
	)
}
