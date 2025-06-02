import FixedExpenseCard from '@/components/fixed-expense-card'
import GoalCard from '@/components/goal-card'
import Header from '@/components/header'
import QuickStats from '@/components/quick-stats'
import TransactionHistory from '@/components/transaction-history'
import { type JSX } from 'react'

export default function Home(): JSX.Element {
	return (
		<div className="w-full md:mx-auto md:max-w-[1600px] p-5 justify-items-center bg-base-100">
			<Header />

			<main className="grid w-full grid-cols-2 col-span-1 gap-6 p-2 mt-4 md:grid-cols-4">
				<div className="w-full col-span-2 space-y-4 md:col-span-3">
					<QuickStats />
					<TransactionHistory />
				</div>

				<div className="flex flex-col col-span-2 grid-rows-2 gap-6 overflow-auto md:col-span-1">
					<FixedExpenseCard />
					<GoalCard />
				</div>
			</main>
		</div>
	)
}
