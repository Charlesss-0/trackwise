import AnalysisOverview from '@/components/chart/chartCard'
import FixedExpenseCard from '@/components/expenses/fixedExpenseCard'
import GoalCard from '@/components/goals/goalCard'
import Header from '@/components/header/header'
import QuickStats from '@/components/quickStats/quickStats'
import TransactionHistory from '@/components/transactions/transactionHistory'

export default function Home(): React.ReactNode {
	return (
		<div className="w-full mx-auto max-w-[1600px] p-5 justify-items-center bg-base-100 dark:bg-base-100-dark">
			<Header />

			<main className="grid w-full grid-cols-1 gap-6 p-2 mt-4 md:grid-cols-4">
				<div className="grid col-span-1 gap-6 md:col-span-3">
					<QuickStats />
					<AnalysisOverview />
					<TransactionHistory />
				</div>

				<div className="flex flex-col grid-rows-2 gap-6 overflow-auto">
					<FixedExpenseCard />
					<GoalCard />
				</div>
			</main>
		</div>
	)
}
