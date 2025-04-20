import AnalysisOverview from '@/components/cards/analysis-overview'
import FixedExpenses from '@/components/cards/fixed-expenses'
import Goals from '@/components/cards/goals'
import Header from '@/components/header'
import QuickStats from '@/components/cards/quick-stats'
import TransactionHistory from '@/components/cards/transaction-history'

export default function Home(): React.ReactNode {
	return (
		<div className="w-full mx-auto max-w-[1600px] p-5 justify-items-center bg-base-100 dark:bg-base-100-dark">
			<Header />

			<main className="w-full p-4">
				<QuickStats />

				<div className="grid grid-cols-1 grid-rows-2 gap-6 mt-6 md:grid-cols-4">
					<AnalysisOverview />
					<FixedExpenses />
					<TransactionHistory />
					<Goals />
				</div>
			</main>
		</div>
	)
}
