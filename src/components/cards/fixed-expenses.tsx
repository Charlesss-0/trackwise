import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export default function FixedExpenses(): React.ReactNode {
	return (
		<Card className="col-span-1 md:col-span-1">
			<h2 className="text-lg font-medium text-neutral">Fixed Expenses</h2>
			<div className="flex flex-col items-center justify-center h-full">
				<p className="text-sm font-medium text-neutral">No fixed expenses set yet.</p>
				<Button variant="outline" className="mt-4">
					Add Fixed Expense
				</Button>
			</div>
		</Card>
	)
}
