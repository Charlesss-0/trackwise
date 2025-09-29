import { type JSX } from 'react'
import { ThemeToggle } from '@/components/shared/theme-toggle'

type Props = {
	title: string
	description: string
}

export default function PageHeader({ title, description }: Props): JSX.Element {
	return (
		<div className="flex justify-between items-center">
			<div className="flex flex-col gap-2">
				<h1 className="text-2xl font-bold">{title}</h1>
				<p className="text-sm">{description}</p>
			</div>

			<ThemeToggle />
		</div>
	)
}
