import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type State = {
	categories: BudgetCategory[]
}

type Actions = {
	addCategory: (category: BudgetCategory) => void
	updateCategory: (category: BudgetCategory) => void
	deleteCategory: (id: string) => void
}

type BudgetStore = State & Actions

export const useBudgetStore = create(
	persist<BudgetStore>(
		set => ({
			categories: [],
			addCategory: (category: BudgetCategory): void => {
				set(state => ({ ...state, categories: [...state.categories, category] }))
			},
			updateCategory: (category: BudgetCategory): void => {
				set(state => ({
					...state,
					categories: state.categories.map(item => (item.id === category.id ? category : item)),
				}))
			},
			deleteCategory: (id: string): void => {
				set(state => ({
					...state,
					categories: state.categories.filter(category => category.id !== id),
				}))
			},
		}),
		{
			name: 'budget-store',
		}
	)
)
