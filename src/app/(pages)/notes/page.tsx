import PageHeader from '@/components/shared/page-header'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { type JSX } from 'react'
import Reminders from '@/pages/notes/_components/reminders'
import NotesList from '@/pages/notes/_components/notes-list'

export default function Notes(): JSX.Element {
	return (
		<>
			<PageHeader title="Notes" description="Manage your notes and tasks" />

			<div className="flex justify-end">
				<Button className="self-end">
					<Plus className="w-5 h-5" />
					<span>Add Note</span>
				</Button>
			</div>

			<div className="flex flex-col gap-10">
				<Reminders />

				<NotesList />
			</div>
		</>
	)
}
