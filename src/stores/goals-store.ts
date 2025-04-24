import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type State = {
	goals: Goal[]
}

type Actions = {
	addGoal: (goal: Goal) => void
	updateGoal: (id: string, goal: Goal) => void
	deleteGoal: (id: string) => void
}

type GoalStore = State & Actions

export const useGoalStore = create(
	persist<GoalStore>(
		set => ({
			goals: [],
			addGoal: (goal: Goal): void => set(state => ({ ...state, goals: [...state.goals, goal] })),
			updateGoal: (id: string, goal: Goal): void =>
				set(state => ({
					...state,
					goals: state.goals.map(item => (item.id === id ? goal : item)),
				})),
			deleteGoal: (id: string): void =>
				set(state => ({ ...state, goals: state.goals.filter(goal => goal.id !== id) })),
		}),
		{
			name: 'goals-store',
		}
	)
)
