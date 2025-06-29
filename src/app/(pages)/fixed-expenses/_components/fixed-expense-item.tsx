import { CircleCheck, Trash2 } from 'lucide-react'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'

import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { type JSX } from 'react'

export default function FixedExpenseItem({
	expense,
	onEdit,
	onDelete,
	onAddPayment,
}: {
	expense: FixedExpense
	onEdit: () => void
	onDelete: () => void
	onAddPayment: () => void
}): JSX.Element {
	return (
		<Card className="rounded-md bg-base-100 hover:cursor-pointer" onClick={onEdit}>
			<CardHeader className="flex justify-between text-xs">
				<div className="flex flex-col gap-1">
					<span className="text-base-content">{expense.name}</span>
				</div>

				<div className="flex items-center gap-1">
					<span className="font-medium text-neutral bg-base-content/10 rounded-full px-2 py-1">
						{expense.category}
					</span>

					<Button
						variant="ghost"
						size="icon"
						className="hover:bg-base-200 dark:hover:bg-base-300 size-9"
						onClick={e => {
							e.stopPropagation()
							onDelete()
						}}
					>
						<Trash2 size={14} className="text-red-400" />

						<span className="sr-only">Delete</span>
					</Button>
				</div>
			</CardHeader>

			<CardContent className="flex-col gap-2 text-xs">
				<div className="flex justify-between">
					<span>Progress</span>

					<span>
						${expense.currentAmount ? expense.currentAmount.toFixed(2) : '0.00'} / $
						{expense.targetAmount.toFixed(2)}
					</span>
				</div>

				<Progress value={(expense.currentAmount / expense.targetAmount) * 100} />
			</CardContent>

			<CardFooter className="justify-end">
				{expense.isPaid ? (
					<div className="flex items-center justify-center w-full gap-2 p-2 text-center rounded-full bg-light-green/30 dark:bg-light-green/20">
						<CircleCheck size={16} className="text-green-primary dark:text-light-green" />

						<span className="text-sm font-medium text-green-primary dark:text-light-green">
							Paid
						</span>
					</div>
				) : (
					<Button
						className="text-xs rounded-full"
						size="sm"
						onClick={e => {
							e.stopPropagation()
							onAddPayment()
						}}
					>
						Add Payment
					</Button>
				)}
			</CardFooter>
		</Card>
	)
}
