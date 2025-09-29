import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type State = {
	expenses: Expense[]
}

type Actions = {
	addExpense: (expense: Expense) => void
	updateExpense: (id: string, expense: Expense) => void
	deleteExpense: (id: string) => void
}

type ExpenseStore = State & Actions

export const useExpenseStore = create(
	persist<ExpenseStore>(
		set => ({
			expenses: [],
			addExpense: (expense: Expense): unknown =>
				set(state => ({ ...state, expenses: [...state.expenses, expense] })),
			updateExpense: (id: string, expense: Expense): unknown =>
				set(state => ({
					...state,
					expenses: state.expenses.map(item => (item.id === id ? expense : item)),
				})),
			deleteExpense: (id: string): unknown =>
				set(state => ({ ...state, expenses: state.expenses.filter(expense => expense.id !== id) })),
		}),
		{
			name: 'expense-store',
		}
	)
)
