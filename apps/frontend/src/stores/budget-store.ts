import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type State = {
	budgetCategory: BudgetCategory[]
}

type Actions = {
	addBudgetCategory: (category: BudgetCategory) => void
	updateBudgetCategory: (id: string, category: BudgetCategory) => void
	deleteBudgetCategory: (id: string) => void
}

type BudgetStore = State & Actions

export const useBudgetStore = create(
	persist<BudgetStore>(
		set => ({
			budgetCategory: [],
			addBudgetCategory: (budgetCategory: BudgetCategory): void => {
				set(state => ({ ...state, budgetCategory: [...state.budgetCategory, budgetCategory] }))
			},
			updateBudgetCategory: (id, budgetCategory: BudgetCategory): void => {
				set(state => ({
					...state,
					budgetCategory: state.budgetCategory.map(category =>
						category.id === id ? budgetCategory : category
					),
				}))
			},
			deleteBudgetCategory: (id: string): void => {
				set(state => ({
					...state,
					budgetCategory: state.budgetCategory.filter(category => category.id !== id),
				}))
			},
		}),
		{
			name: 'budget-store',
		}
	)
)
