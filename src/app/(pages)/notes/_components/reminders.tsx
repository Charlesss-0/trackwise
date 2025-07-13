'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useNotesAndRemindersStore } from '@/stores/notes-and-reminders-store'
import { formatDate } from '@/utils/format-date'
import { Info, Trash2 } from 'lucide-react'
import { type JSX } from 'react'

export default function Reminders(): JSX.Element {
	const { reminders, deleteReminder } = useNotesAndRemindersStore()

	return (
		<div className="flex flex-col gap-2">
			<div className="flex items-center gap-2">
				<Info />

				<span className="text-2xl font-bold">Reminders</span>
			</div>

			{reminders.length > 0 ? (
				reminders.map(reminder => (
					<Card className="border-l-4 border-l-orange-300" key={reminder.id}>
						<div className="flex items-center justify-between">
							<div className="flex flex-col gap-1">
								<span className="text-base-content font-semibold">{reminder.title}</span>

								<span className="text-sm text-base-content">{reminder.content}</span>

								<span className="text-sm text-neutral">Due {formatDate(reminder.dueDate)}</span>
							</div>

							<Button
								variant="ghost"
								size="icon"
								className="hover:bg-base-200 dark:hover:bg-base-300 size-9"
								onClick={e => {
									e.stopPropagation()
									deleteReminder(reminder.id)
								}}
							>
								<Trash2 className="text-red-400" />

								<span className="sr-only">Delete</span>
							</Button>
						</div>
					</Card>
				))
			) : (
				<div className="flex items-center justify-center h-64">
					<span className="font-medium text-neutral">No reminders set yet.</span>
				</div>
			)}
		</div>
	)
}
