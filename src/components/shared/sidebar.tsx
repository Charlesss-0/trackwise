'use client'

import { useMemo, type JSX } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/utils/cn'
import { usePathname, useRouter } from 'next/navigation'
import {
	Calendar,
	ChartColumn,
	CircleDollarSign,
	LayoutDashboard,
	NotebookPen,
	Target,
} from 'lucide-react'

export default function Sidebar(): JSX.Element {
	const router = useRouter()
	const pathname = usePathname()

	const navigation = useMemo(
		() =>
			[
				{
					name: 'Dashboard',
					href: '/dashboard',
					icon: <LayoutDashboard />,
				},
				{
					name: 'Analysis',
					href: '/analysis',
					icon: <ChartColumn />,
				},
				{
					name: 'Budget',
					href: '/budget',
					icon: <CircleDollarSign />,
				},
				{
					name: 'Goals',
					href: '/goals',
					icon: <Target />,
				},
				{
					name: 'Fixed Expenses',
					href: '/fixed-expenses',
					icon: <Calendar />,
				},
				{
					name: 'Notes',
					href: '/notes',
					icon: <NotebookPen />,
				},
			] as const,
		[]
	)

	return (
		<aside className="hidden p-4 py-10 border-r h-svh md:block md:w-max bg-base-200 border-base-300">
			<nav className="flex flex-col gap-4">
				{navigation.map(({ name, href, icon }) => (
					<Button
						key={href}
						variant="ghost"
						className={cn(
							'justify-start h-10 font-medium',
							pathname.includes(href) ? 'bg-base-300' : ''
						)}
						onClick={() => router.push(href)}
					>
						{icon}

						{name}
					</Button>
				))}
			</nav>
		</aside>
	)
}
