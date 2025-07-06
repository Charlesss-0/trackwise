'use client'

import { Button } from '@/components/ui/button'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'
import { Switch } from '@/components/ui/switch'
import { useState, type JSX } from 'react'

export default function AddNoteDialog({
	open,
	openChange,
}: {
	open: boolean
	openChange: (open: boolean) => void
}): JSX.Element {
	const [isReminder, setIsReminder] = useState(false)

	return (
		<Dialog open={open} onOpenChange={openChange}>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Add a note</DialogTitle>

					<DialogDescription>
						Add a note to keep track of your tasks and reminders.
					</DialogDescription>
				</DialogHeader>

				<form className="mt-4">
					<div className="grid gap-4 mb-6 [&>fieldset]:flex [&>fieldset]:flex-col [&>fieldset]:gap-2">
						<fieldset>
							<label htmlFor="note-title">Title</label>

							<input
								type="text"
								name="note-title"
								id="note-title"
								className="input"
								placeholder="Title"
							/>
						</fieldset>

						<fieldset>
							<label htmlFor="note-description">Description</label>

							<textarea
								name="note-description"
								id="note-description"
								className="textarea"
								placeholder="Description"
							/>
						</fieldset>

						<fieldset>
							<label htmlFor="note-reminder">Set as reminder</label>

							<Switch id="note-reminder" checked={isReminder} onCheckedChange={setIsReminder} />
						</fieldset>
					</div>

					<DialogFooter>
						<Button type="submit">Save</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	)
}
