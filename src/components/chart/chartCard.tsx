'use client'

import {
	Area,
	AreaChart,
	CartesianGrid,
	Legend,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from 'recharts'

import { Card } from '@/components/ui/card'
import ChartTooltip from '@/components/chart/chartTooltip'
import { useExpenseStore } from '@/stores/expenses-store'
import { useFixedExpenseStore } from '@/stores/fixed-expenses-store'
import { useGoalStore } from '@/stores/goals-store'
import { useIncomeStore } from '@/stores/income-store'
import { useTheme } from 'next-themes'

export default function ChartCard(): React.ReactNode {
	const { theme } = useTheme()
	const { income } = useIncomeStore()
	const { expenses } = useExpenseStore()
	const { fixedExpenses } = useFixedExpenseStore()
	const { goals } = useGoalStore()

	const chartData = Array.from({ length: 6 }, (_, i) => {
		const month = new Date()
		month.setMonth(month.getMonth() - i)
		const monthStr = month.toLocaleString('default', { month: 'short' })

		const monthIncome = income
			.filter(inc => new Date(inc.createdAt).getMonth() === month.getMonth())
			.reduce((sum, inc) => sum + inc.amount, 0)

		const monthExpenses = expenses
			.filter(exp => new Date(exp.createdAt).getMonth() === month.getMonth())
			.reduce((sum, exp) => sum + exp.amount, 0)

		const monthFixedExpenses = fixedExpenses
			.filter(exp => new Date(exp.dueDate).getMonth() === month.getMonth())
			.reduce((sum, exp) => sum + exp.currentAmount, 0)

		const monthContributions = goals.reduce((sum, goal) => {
			const contributions = goal.contributions || []
			return (
				sum +
				contributions
					.filter(c => new Date(c.createdAt).getMonth() === month.getMonth())
					.reduce((total, c) => total + c.amount, 0)
			)
		}, 0)

		return {
			month: monthStr,
			income: monthIncome,
			expenses: monthExpenses + monthFixedExpenses,
			available: monthIncome - monthExpenses - monthFixedExpenses - monthContributions,
		}
	}).reverse()

	return (
		<Card>
			<h2 className="text-lg font-medium text-neutral">Analysis Overview</h2>
			<ResponsiveContainer className="w-full h-full md:pt-4 md:pr-12 aspect-video">
				<AreaChart data={chartData} className="w-full h-full pr-4">
					<defs>
						<linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
							<stop offset="5%" stopColor="#00a43b" stopOpacity={0.3} />
							<stop offset="95%" stopColor="#00a43b" stopOpacity={0} />
						</linearGradient>
						<linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
							<stop offset="5%" stopColor="#d9487e" stopOpacity={0.3} />
							<stop offset="95%" stopColor="#d9487e" stopOpacity={0} />
						</linearGradient>
						<linearGradient id="colorAvailable" x1="0" y1="0" x2="0" y2="1">
							<stop offset="5%" stopColor="#0090b5" stopOpacity={0.3} />
							<stop offset="95%" stopColor="#0090b5" stopOpacity={0} />
						</linearGradient>
					</defs>
					<Area
						type="monotone"
						dataKey="income"
						stroke="#00a43b"
						fillOpacity={1}
						fill="url(#colorIncome)"
					/>
					<Area
						type="monotone"
						dataKey="expenses"
						stroke="#d73b37"
						fillOpacity={1}
						fill="url(#colorExpenses)"
					/>
					<Area
						type="monotone"
						dataKey="available"
						stroke="#0090b5"
						fillOpacity={1}
						fill="url(#colorAvailable)"
					/>
					<CartesianGrid strokeDasharray="2 2" stroke="#8a97ac" />
					<XAxis
						dataKey="month"
						stroke={theme === 'dark' ? '#f1f2f4' : '#242b2f'}
						className="text-xs md:text-sm"
					/>
					<YAxis stroke={theme === 'dark' ? '#f1f2f4' : '#242b2f'} className="text-xs md:text-sm" />
					<Tooltip content={<ChartTooltip />} />
					<Legend className="text-xs md:text-sm" />
				</AreaChart>
			</ResponsiveContainer>
		</Card>
	)
}
