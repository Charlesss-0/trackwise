import { useExpenseStore } from '@/stores/expenses-store'
import { useFixedExpenseStore } from '@/stores/fixed-expenses-store'
import { useGoalStore } from '@/stores/goals-store'
import { useIncomeStore } from '@/stores/income-store'

type Stats = {
	totalIncome: string
	totalExpenses: string
	totalFixedExpenses: string
	totalContributions: string
	availableMoney: string
}

export default function useStats(): Stats {
	const { income } = useIncomeStore()
	const { expenses } = useExpenseStore()
	const { goals } = useGoalStore()
	const { fixedExpenses } = useFixedExpenseStore()

	const totalIncome = income.reduce((acc, curr) => Number(acc + curr.amount), 0).toFixed(2)
	const totalExpenses = expenses.reduce((acc, curr) => Number(acc + curr.amount), 0).toFixed(2)
	const totalContributions = goals.reduce((acc, curr) => acc + curr.currentAmount, 0).toFixed(2)
	const totalFixedExpenses = fixedExpenses
		.reduce((acc, curr) => Number(acc + curr.currentAmount), 0)
		.toFixed(2)
	const availableMoney = (
		Number(totalIncome) -
		(Number(totalExpenses) + Number(totalContributions) + Number(totalFixedExpenses))
	).toFixed(2)

	return {
		totalIncome,
		totalExpenses,
		totalFixedExpenses,
		totalContributions,
		availableMoney,
	}
}
