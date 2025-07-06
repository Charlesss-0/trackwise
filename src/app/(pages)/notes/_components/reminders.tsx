import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Info, Trash2 } from 'lucide-react'
import { type JSX } from 'react'

export default function Reminders(): JSX.Element {
	return (
		<div className="flex flex-col gap-2">
			<div className="flex items-center gap-2">
				<Info />

				<span className="text-2xl font-bold">Reminders</span>
			</div>

			<Card className="bg-white border-l-4 border-r-0 rounded-md shadow-sm border-y-0 border-l-warning dark:bg-base-300">
				<div className="flex items-center justify-between">
					<div className="flex flex-col gap-1">
						<span className="text-base-content">Take out the trash</span>
					</div>

					<Button
						variant="ghost"
						size="icon"
						className="hover:bg-base-200 dark:hover:bg-base-300 size-9"
					>
						<Trash2 className="text-red-400" />

						<span className="sr-only">Delete</span>
					</Button>
				</div>
			</Card>
		</div>
	)
}
