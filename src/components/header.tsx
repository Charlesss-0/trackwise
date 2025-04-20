import { Plus, Wallet } from 'lucide-react'

import { Button } from './ui/button'
import { ThemeToggle } from './theme-toggle'

export default function Header(): React.ReactNode {
	const ACTION_BUTTONS = [
		{
			name: 'Add Income',
			icon: <Plus className="w-5 h-5" />,
			size: 'lg',
			variant: 'default',
			action: (): void => {
				// Add income action
			},
		},
		{
			name: 'Add Expense',
			icon: <Wallet className="w-5 h-5" />,
			size: 'lg',
			variant: 'destructive',
			action: (): void => {
				// Add expense action
			},
		},
	] as const

	return (
		<header className="flex items-center justify-end w-full gap-6 p-4">
			<div className="flex gap-4">
				{ACTION_BUTTONS.map(btn => (
					<Button key={btn.name} size={btn.size} variant={btn.variant}>
						{btn.icon}
						<span>{btn.name}</span>
					</Button>
				))}
			</div>
			<ThemeToggle />
		</header>
	)
}
