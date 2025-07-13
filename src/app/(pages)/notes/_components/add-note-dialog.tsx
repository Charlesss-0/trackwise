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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { FREQUENCIES } from '@/data/default-categories'
import { useNotesAndRemindersStore } from '@/stores/notes-and-reminders-store'
import { capitalize } from '@/utils/capitalize'
import React, { useState, type JSX } from 'react'

interface FormData extends Note, Reminder {}

export default function AddNoteDialog({
	open,
	openChange,
}: {
	open: boolean
	openChange: (open: boolean) => void
}): JSX.Element {
	const { addNote, addReminder } = useNotesAndRemindersStore()
	const [isReminder, setIsReminder] = useState(false)
	const [formData, setFormData] = useState<FormData>({
		id: crypto.randomUUID(),
		title: '',
		content: '',
		dueDate: '',
		recurring: false,
		recurringFrequency: '',
		createdAt: Date.now(),
	})

	const updateFormData = (field: keyof Note | keyof Reminder, value: string | boolean): void => {
		setFormData(prev => ({ ...prev, [field]: value }))
	}

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
		e.preventDefault()

		if (isReminder) {
			const reminderData: Reminder = {
				id: formData.id,
				title: formData.title,
				content: formData.content,
				dueDate: formData.dueDate,
				recurring: formData.recurring,
				recurringFrequency: formData.recurringFrequency,
				createdAt: Date.now(),
			}

			addReminder(reminderData)
		} else {
			const noteData: Note = {
				id: formData.id,
				title: formData.title,
				content: formData.content,
				createdAt: Date.now(),
			}

			addNote(noteData)
		}

		openChange(false)
		setFormData({
			id: crypto.randomUUID(),
			title: '',
			content: '',
			dueDate: '',
			recurring: false,
			recurringFrequency: '',
			createdAt: Date.now(),
		})
	}

	return (
		<Dialog open={open} onOpenChange={openChange}>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Add a note</DialogTitle>

					<DialogDescription>
						Add a note to keep track of your tasks and reminders.
					</DialogDescription>
				</DialogHeader>

				<form className="mt-4" onSubmit={handleSubmit}>
					<div className="grid gap-4 mb-6 [&>fieldset]:flex [&>fieldset]:flex-col [&>fieldset]:gap-2">
						<fieldset>
							<label htmlFor="note-title">Title</label>

							<input
								type="text"
								name="note-title"
								id="note-title"
								className="input"
								value={formData.title}
								onChange={e => updateFormData('title', e.target.value)}
								required
							/>
						</fieldset>

						<fieldset>
							<label htmlFor="note-description">Description</label>

							<textarea
								name="note-description"
								id="note-description"
								className="textarea"
								value={formData.content}
								onChange={e => updateFormData('content', e.target.value)}
								required
							/>
						</fieldset>

						{isReminder && (
							<>
								<fieldset>
									<label htmlFor="note-reminder-due-date">Due date</label>

									<input
										type="date"
										name="note-reminder-due-date"
										id="note-reminder-due-date"
										className="input"
										placeholder="Due date"
										value={formData.dueDate}
										onChange={e => updateFormData('dueDate', e.target.value)}
										required
									/>
								</fieldset>

								<fieldset>
									<label htmlFor="note-reminder-recurring">Recurring</label>

									<Switch
										id="note-reminder-recurring"
										checked={formData.recurring}
										onCheckedChange={() => updateFormData('recurring', !formData.recurring)}
									/>
								</fieldset>

								{formData.recurring && (
									<fieldset>
										<label htmlFor="note-reminder-recurring-interval">Recurring frequency</label>

										<Select
											value={formData.recurringFrequency}
											onValueChange={recurringFrequency =>
												updateFormData('recurringFrequency', recurringFrequency)
											}
										>
											<SelectTrigger className="col-span-3">
												<SelectValue placeholder="Select frequency" />
											</SelectTrigger>

											<SelectContent>
												{FREQUENCIES.map(frequency => (
													<SelectItem key={frequency} value={frequency}>
														{capitalize(frequency)}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</fieldset>
								)}
							</>
						)}

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
