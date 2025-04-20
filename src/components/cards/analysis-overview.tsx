'use client'

import {
	Area,
	AreaChart,
	CartesianGrid,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from 'recharts'

import { Card } from '../ui/card'
import { useTheme } from 'next-themes'

const chartData = Array.from({ length: 6 }, (_, i) => {
	const month = new Date()
	month.setMonth(month.getMonth() - i)
	const monthStr = month.toLocaleString('default', { month: 'short' })

	// const monthIncome = incomeList
	// 	.filter(inc => new Date(inc.date).getMonth() === month.getMonth())
	// 	.reduce((sum, inc) => sum + inc.amount, 0)

	// const monthExpenses = expensesList
	// 	.filter(exp => new Date(exp.date).getMonth() === month.getMonth())
	// 	.reduce((sum, exp) => sum + exp.amount, 0)

	// const monthFixedExpenses = fixedExpensesList
	// 	.filter(exp => new Date(exp.dueDate).getMonth() === month.getMonth())
	// 	.reduce((sum, exp) => sum + exp.currentAmount, 0)

	// const monthContributions = goalsList.reduce((sum, goal) => {
	// 	const contributions = goal.contributions || []
	// 	return (
	// 		sum +
	// 		contributions
	// 			.filter(c => new Date(c.date).getMonth() === month.getMonth())
	// 			.reduce((total, c) => total + c.amount, 0)
	// 	)
	// }, 0)

	return {
		month: monthStr,
		income: 0,
		expenses: 0,
		available: 0,
	}
}).reverse()

export default function AnalysisOverview(): React.ReactNode {
	const { theme } = useTheme()

	return (
		<Card className="col-span-1 md:col-span-3">
			<h2 className="text-lg font-medium text-neutral">Analysis Overview</h2>
			<ResponsiveContainer aspect={3 / 1} className="w-full h-full pt-4 pr-12">
				<AreaChart data={chartData}>
					<CartesianGrid className="stroke-base-300 dark:stroke-base-300-dark" />
					<XAxis dataKey="month" className="stroke-primary text-primary" />
					<YAxis dataKey="income" />
					<Tooltip
						contentStyle={{
							backgroundColor: theme === 'dark' ? '#060d1c' : '#e9ebed',
							border: theme === 'dark' ? '#182230' : '#d3d4d6',
							padding: '15px',
						}}
						wrapperClassName="rounded-lg shadow-lg"
						labelClassName="text-info font-bold dark:text-info-dark"
					/>
					<Area
						type="monotone"
						dataKey="income"
						name="Income"
						stackId="1"
						stroke="#8884d8"
						fill="#8884d8"
					/>
					<Area
						type="monotone"
						dataKey="expenses"
						name="Expenses"
						stackId="1"
						stroke="#82ca9d"
						fill="#82ca9d"
					/>
					<Area
						type="monotone"
						dataKey="available"
						name="Available"
						stackId="1"
						stroke="#ffc658"
						fill="#ffc658"
					/>
				</AreaChart>
			</ResponsiveContainer>
		</Card>
	)
}
