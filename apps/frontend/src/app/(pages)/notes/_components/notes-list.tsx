'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useNotesAndRemindersStore } from '@/stores/notes-and-reminders-store'
import { format } from 'date-fns'
import { FileText, Trash2 } from 'lucide-react'
import { type JSX } from 'react'

export default function NotesList(): JSX.Element {
	const { notes, deleteNote } = useNotesAndRemindersStore()

	return (
		<div className="flex flex-col gap-2">
			<div className="flex items-center gap-2">
				<FileText />

				<span className="text-2xl font-bold">Notes</span>
			</div>

			{notes.length > 0 ? (
				notes.map(note => (
					<Card key={note.id}>
						<div className="flex items-center justify-between">
							<div className="flex flex-col gap-1">
								<span className="text-base-content font-semibold">{note.title}</span>

								<span className="text-sm text-base-content">{note.content}</span>

								<span className="text-sm text-neutral">
									Created {format(new Date(note.createdAt), 'MMM dd, yyyy')}
								</span>
							</div>

							<Button
								variant="ghost"
								size="icon"
								className="hover:bg-base-200 dark:hover:bg-base-300 size-9"
								onClick={e => {
									e.stopPropagation()
									deleteNote(note.id)
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
					<span className="font-medium text-neutral">No notes set yet.</span>
				</div>
			)}
		</div>
	)
}
