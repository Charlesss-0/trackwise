'use client'

import AddFixedExpense from '@/components/add-fixed-expense-dialog'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useState } from 'react'

export default function FixedExpenses(): React.ReactNode {
	const [addFixedExpenseOpen, setAddFixedExpenseOpen] = useState<boolean>(false)

	return (
		<>
			<Card className="col-span-1 md:col-span-1">
				<h2 className="text-lg font-medium text-neutral">Fixed Expenses</h2>
				<div className="flex flex-col items-center justify-center h-full">
					<p className="text-sm font-medium text-neutral">No fixed expenses set yet.</p>
					<Button variant="outline" className="mt-4" onClick={() => setAddFixedExpenseOpen(true)}>
						Add Fixed Expense
					</Button>
				</div>
			</Card>
			<AddFixedExpense open={addFixedExpenseOpen} onOpenChange={setAddFixedExpenseOpen} />
		</>
	)
}
