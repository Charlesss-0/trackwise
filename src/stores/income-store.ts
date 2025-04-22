import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type State = {
	income: Income[]
}

type Actions = {
	addIncome: (income: Income) => void
	removeIncome: (id: string) => void
}

type IncomeStore = State & Actions

export const useIncomeStore = create(
	persist<IncomeStore>(
		set => ({
			income: [],
			addIncome: (income: Income): void =>
				set(state => ({ ...state, income: [...state.income, income] })),
			removeIncome: (id: string): void =>
				set(state => ({ ...state, income: state.income.filter(income => income.id !== id) })),
		}),
		{
			name: 'income-store',
		}
	)
)
