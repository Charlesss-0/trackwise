import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type State = {
	fixedExpenses: FixedExpense[]
}

type Actions = {
	addFixedExpense: (fixedExpense: FixedExpense) => void
	updateFixedExpense: (id: string, fixedExpense: FixedExpense) => void
	deleteFixedExpense: (id: string) => void
}

type FixedExpenseStore = State & Actions

export const useFixedExpenseStore = create(
	persist<FixedExpenseStore>(
		set => ({
			fixedExpenses: [],
			addFixedExpense: (fixedExpense: FixedExpense): unknown =>
				set(state => ({ ...state, fixedExpenses: [...state.fixedExpenses, fixedExpense] })),
			updateFixedExpense: (id: string, fixedExpense: FixedExpense): unknown =>
				set(state => ({
					...state,
					fixedExpenses: state.fixedExpenses.map(item => (item.id === id ? fixedExpense : item)),
				})),
			deleteFixedExpense: (id: string): unknown =>
				set(state => ({
					...state,
					fixedExpenses: state.fixedExpenses.filter(fixedExpense => fixedExpense.id !== id),
				})),
		}),
		{
			name: 'fixed-expenses-store',
		}
	)
)
