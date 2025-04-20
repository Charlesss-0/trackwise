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
import { ArrowDownCircle, PiggyBank, Plus, Target, TrendingUp, Wallet } from 'lucide-react'
import { Card, CardHeader } from '@/components/ui/card'

import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/theme-toggle'
import TransactionHistory from '@/components/transaction-history'
import { cn } from '@/utils/cn'
import { useTheme } from 'next-themes'

const QUICK_STATS = [
	{
		name: 'Total Income',
		value: 0,
		valueColor: 'text-green-primary',
		icon: <TrendingUp className="w-4 h-4 text-green-primary" />,
	},
	{
		name: 'Total Expenses',
		value: 0,
		valueColor: 'text-destructive',
		icon: <ArrowDownCircle className="w-4 h-4 text-destructive" />,
	},
	{
		name: 'Goal Contributions',
		value: 0,
		valueColor: 'text-info dark:text-info-dark',
		icon: <Target className="w-4 h-4 text-info dark:text-info-dark" />,
	},
	{
		name: 'Available Money',
		value: 0,
		valueColor: 'text-info dark:text-info-dark',
		icon: <PiggyBank className="w-4 h-4 text-info dark:text-info-dark" />,
	},
] as const

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
		income: 260,
		expenses: 100,
		available: 160,
	}
}).reverse()

export default function Home(): React.ReactNode {
	const { theme } = useTheme()

	const ACTION_BUTTONS = [
		{
			name: 'Add Income',
			icon: <Plus className="w-5 h-5" />,
			size: 'lg',
			variant: 'default',
			action: (): void => {
				// Add income action
			},
		},
		{
			name: 'Add Expense',
			icon: <Wallet className="w-5 h-5" />,
			size: 'lg',
			variant: 'destructive',
			action: (): void => {
				// Add expense action
			},
		},
	] as const

	return (
		<div className="max-w-[1600px] p-5 justify-items-center bg-base-100 dark:bg-base-100-dark">
			<header className="flex items-center justify-end w-full gap-6 p-4">
				<div className="flex gap-4">
					{ACTION_BUTTONS.map(btn => (
						<Button key={btn.name} size={btn.size} variant={btn.variant}>
							{btn.icon}
							<span>{btn.name}</span>
						</Button>
					))}
				</div>
				<ThemeToggle />
			</header>

			<main className="w-full p-4">
				<div className="grid grid-cols-1 gap-6 md:grid-cols-4">
					{QUICK_STATS.map(stat => (
						<Card key={stat.name}>
							<CardHeader>
								<span className="text-neutral">{stat.name}</span>
								{stat.icon}
							</CardHeader>
							<p className={cn('text-2xl font-bold', stat.valueColor)}>${stat.value}</p>
						</Card>
					))}
				</div>

				<div className="grid grid-cols-1 grid-rows-2 gap-6 mt-6 md:grid-cols-4">
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

					<Card className="col-span-1 md:col-span-1">
						<h2 className="text-lg font-medium text-neutral">Goals</h2>
						<div className="flex flex-col items-center justify-center h-full">
							<p className="text-neutral">No goals set yet.</p>
							<Button variant="outline" className="mt-4">
								Add Goal
							</Button>
						</div>
					</Card>

					<TransactionHistory />
				</div>
			</main>
		</div>
	)
}
