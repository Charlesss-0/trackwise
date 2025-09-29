import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type State = {
	notes: Note[]
	reminders: Reminder[]
}

type Actions = {
	addNote: (note: Note) => void
	updateNote: (note: Note) => void
	deleteNote: (id: string) => void

	addReminder: (reminder: Reminder) => void
	updateReminder: (reminder: Reminder) => void
	deleteReminder: (id: string) => void
}

type NotesAndRemindersStore = State & Actions

export const useNotesAndRemindersStore = create(
	persist<NotesAndRemindersStore>(
		set => ({
			notes: [],
			reminders: [],
			addNote: (note): void => {
				set(state => ({ ...state, notes: [...state.notes, note] }))
			},
			updateNote: (note): void => {
				set(state => ({
					...state,
					notes: state.notes.map(item => (item.id === note.id ? note : item)),
				}))
			},
			deleteNote: (id: string): void => {
				set(state => ({ ...state, notes: state.notes.filter(note => note.id !== id) }))
			},
			addReminder: (reminder): void => {
				set(state => ({ ...state, reminders: [...state.reminders, reminder] }))
			},
			updateReminder: (reminder): void => {
				set(state => ({
					...state,
					reminders: state.reminders.map(item => (item.id === reminder.id ? reminder : item)),
				}))
			},
			deleteReminder: (id: string): void => {
				set(state => ({
					...state,
					reminders: state.reminders.filter(reminder => reminder.id !== id),
				}))
			},
		}),
		{
			name: 'notes-and-reminders-store',
		}
	)
)
