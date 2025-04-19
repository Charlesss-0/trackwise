import { ArrowDownCircle, PiggyBank, Plus, Target, TrendingUp, Wallet } from 'lucide-react'
import { Card, CardHeader } from '@/components/ui/card'

import { Button } from '@/components/ui/button'

export default function Home(): React.ReactNode {
	return (
		<div className="max-w-[1600px] h-screen p-5 justify-items-center bg-base-100 dark:bg-base-100-dark">
			<header className="flex items-center justify-end w-full p-4">
				<div className="flex gap-4">
					<Button size="lg">
						<Plus className="w-5 h-5" />
						<span>Add Income</span>
					</Button>
					<Button size="lg" variant="destructive">
						<Wallet className="w-5 h-5" />
						<span>Add Expense</span>
					</Button>
				</div>
			</header>

			<main className="w-full p-4">
				<div className="grid grid-cols-1 gap-6 md:grid-cols-4">
					<Card>
						<CardHeader>
							<span className="text-neutral">Total Income</span>
							<TrendingUp className="w-4 h-4 text-green-500" />
						</CardHeader>
						<p className="text-2xl font-bold text-green-500">$250</p>
					</Card>

					<Card>
						<CardHeader>
							<span className="text-neutral">Total Expenses</span>
							<ArrowDownCircle className="w-4 h-4 text-red-500" />
						</CardHeader>
						<p className="text-2xl font-bold text-destructive">$150</p>
					</Card>

					<Card>
						<CardHeader>
							<span className="text-neutral">Goal Contributions</span>
							<Target className="w-4 h-4 text-info dark:text-info-dark" />
						</CardHeader>
						<p className="text-2xl font-bold text-info dark:text-info-dark">$100</p>
					</Card>

					<Card>
						<CardHeader>
							<span className="text-neutral">Available Money</span>
							<PiggyBank className="w-4 h-4 text-info dark:text-info-dark" />
						</CardHeader>
						<p className="text-2xl font-bold text-info dark:text-info-dark">$100 </p>
					</Card>
				</div>
			</main>
		</div>
	)
}
