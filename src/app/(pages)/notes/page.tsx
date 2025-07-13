'use client'

import PageHeader from '@/components/shared/page-header'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { useState, type JSX } from 'react'
import Reminders from '@/pages/notes/_components/reminders'
import NotesList from '@/pages/notes/_components/notes-list'
import AddNoteDialog from './_components/add-note-dialog'

export default function Notes(): JSX.Element {
	const [addNoteOpen, setAddNoteOpen] = useState<boolean>(false)

	return (
		<div>
			<PageHeader title="Notes" description="Manage your notes and tasks" />

			<div className="flex justify-end">
				<Button className="self-end" onClick={() => setAddNoteOpen(true)}>
					<Plus className="w-5 h-5" />
					<span>Add Note</span>
				</Button>
			</div>

			<div className="flex flex-col gap-10">
				<Reminders />

				<NotesList />
			</div>

			<AddNoteDialog open={addNoteOpen} openChange={setAddNoteOpen} />
		</div>
	)
}
