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
import ChartTooltip from '@/components/chart-tooltip'
import { useExpenseStore } from '@/stores/expenses-store'
import { useFixedExpenseStore } from '@/stores/fixed-expenses-store'
import { useIncomeStore } from '@/stores/income-store'
import { useTheme } from 'next-themes'

export default function AnalysisOverview(): React.ReactNode {
	const { theme } = useTheme()
	const { income } = useIncomeStore()
	const { expenses } = useExpenseStore()
	const { fixedExpenses } = useFixedExpenseStore()

	const chartData = Array.from({ length: 6 }, (_, i) => {
		const month = new Date()
		month.setMonth(month.getMonth() - i)
		const monthStr = month.toLocaleString('default', { month: 'short' })

		const monthIncome = income
			.filter(inc => new Date(inc.timestamp).getMonth() === month.getMonth())
			.reduce((sum, inc) => sum + inc.amount, 0)

		const monthExpenses = expenses
			.filter(exp => new Date(exp.timestamp).getMonth() === month.getMonth())
			.reduce((sum, exp) => sum + exp.amount, 0)

		const monthFixedExpenses = fixedExpenses
			.filter(exp => new Date(exp.dueDate).getMonth() === month.getMonth())
			.reduce((sum, exp) => sum + exp.currentAmount, 0)

		return {
			month: monthStr,
			income: monthIncome,
			expenses: monthExpenses + monthFixedExpenses,
			available: monthIncome - monthExpenses - monthFixedExpenses,
		}
	}).reverse()

	return (
		<Card className="col-span-1 md:col-span-3">
			<h2 className="text-lg font-medium text-neutral">Analysis Overview</h2>
			<ResponsiveContainer aspect={3 / 1} className="w-full h-full pt-4 pr-12">
				<AreaChart data={chartData}>
					<defs>
						<linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
							<stop
								offset="5%"
								stopColor={theme === 'dark' ? '#00a43b' : '#00a43b'}
								stopOpacity={0.3}
							/>
							<stop
								offset="95%"
								stopColor={theme === 'dark' ? '#00a43b' : '#00a43b'}
								stopOpacity={0}
							/>
						</linearGradient>
						<linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
							<stop
								offset="5%"
								stopColor={theme === 'dark' ? '#d9487e' : '#ffd5d3'}
								stopOpacity={0.3}
							/>
							<stop
								offset="95%"
								stopColor={theme === 'dark' ? '#d9487e' : '#ffd5d3'}
								stopOpacity={0}
							/>
						</linearGradient>
						<linearGradient id="colorAvailable" x1="0" y1="0" x2="0" y2="1">
							<stop
								offset="5%"
								stopColor={theme === 'dark' ? '#0090b5' : '#0090b5'}
								stopOpacity={0.3}
							/>
							<stop
								offset="95%"
								stopColor={theme === 'dark' ? '#0090b5' : '#0090b5'}
								stopOpacity={0}
							/>
						</linearGradient>
					</defs>
					<Area
						type="monotone"
						dataKey="income"
						stroke={theme === 'dark' ? '#00a43b' : '#00a43b'}
						fillOpacity={1}
						fill="url(#colorIncome)"
					/>
					<Area
						type="monotone"
						dataKey="expenses"
						stroke={theme === 'dark' ? '#d73b37' : '#d73b37'}
						fillOpacity={1}
						fill="url(#colorExpenses)"
					/>
					<Area
						type="monotone"
						dataKey="available"
						stroke={theme === 'dark' ? '#0090b5' : '#0090b5'}
						fillOpacity={1}
						fill="url(#colorAvailable)"
					/>
					<CartesianGrid strokeDasharray="3 3" stroke="#8a97ac" />
					<XAxis dataKey="month" stroke={theme === 'dark' ? '#f1f2f4' : '#242b2f'} />
					<YAxis stroke={theme === 'dark' ? '#f1f2f4' : '#242b2f'} />
					<Tooltip content={<ChartTooltip />} />
					<Legend />
				</AreaChart>
			</ResponsiveContainer>
		</Card>
	)
}
