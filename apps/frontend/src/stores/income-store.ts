import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type State = {
	income: Income[]
}

type Actions = {
	addIncome: (income: Income) => void
	updateIncome: (id: string, income: Income) => void
	deleteIncome: (id: string) => void
}

type IncomeStore = State & Actions

export const useIncomeStore = create(
	persist<IncomeStore>(
		set => ({
			income: [],
			addIncome: (income: Income): unknown =>
				set(state => ({ ...state, income: [...state.income, income] })),
			updateIncome: (id: string, income: Income): unknown =>
				set(state => ({
					...state,
					income: state.income.map(item => (item.id === id ? income : item)),
				})),
			deleteIncome: (id: string): unknown =>
				set(state => ({ ...state, income: state.income.filter(income => income.id !== id) })),
		}),
		{
			name: 'income-store',
		}
	)
)
