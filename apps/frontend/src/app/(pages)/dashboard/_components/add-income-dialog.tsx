'use client'

import { DEFAULT_INCOME_TYPES, FREQUENCIES } from '@/data/constants'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'

import { Button } from '@/components/ui/button'
import { capitalize } from '@/utils/capitalize'
import { useIncomeStore } from '@/stores/income-store'
import { useState } from 'react'
import { useTransactionsStore } from '@/stores/transactions-store'

export default function AddIncome({
	open,
	onOpenChange,
}: {
	open: boolean
	onOpenChange: (open: boolean) => void
}): React.ReactNode {
	const { addIncome } = useIncomeStore()
	const { addTransaction } = useTransactionsStore()
	const [income, setIncome] = useState<Income>({
		id: crypto.randomUUID(),
		amount: '',
		type: '',
		frequency: '',
		createdAt: Date.now(),
	})

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
		e.preventDefault()

		const transaction: Transaction = {
			id: income.id,
			name: income.type,
			category: income.type,
			amount: income.amount,
			isExpense: false,
			createdAt: income.createdAt,
		}

		addIncome(income)
		addTransaction(transaction)
		onOpenChange(false)
		setIncome({
			id: '',
			amount: '',
			type: '',
			frequency: '',
			createdAt: Date.now(),
		})
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Add Income</DialogTitle>

					<DialogDescription>
						Add your income details. You can specify the type and frequency of your income.
					</DialogDescription>
				</DialogHeader>

				<form onSubmit={handleSubmit}>
					<div className="grid gap-4 my-6 [&>fieldset]:flex [&>fieldset]:flex-col [&>fieldset]:gap-2">
						<fieldset>
							<label htmlFor="amount">Amount</label>

							<input
								type="number"
								value={income.amount}
								onChange={e => setIncome({ ...income, amount: e.target.value })}
								id="amount"
								name="amount"
								placeholder="0.00"
								required
								className="col-span-3 input"
							/>
						</fieldset>

						<fieldset>
							<label htmlFor="type">Type</label>

							<Select value={income.type} onValueChange={type => setIncome({ ...income, type })}>
								<SelectTrigger className="col-span-3">
									<SelectValue placeholder="Select income type" />
								</SelectTrigger>

								<SelectContent>
									{DEFAULT_INCOME_TYPES.map(type => (
										<SelectItem key={type} value={type}>
											{type.charAt(0).toUpperCase() + type.slice(1)}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</fieldset>

						<fieldset>
							<label htmlFor="frequency">Frequency</label>

							<Select
								value={income.frequency}
								onValueChange={frequency => setIncome({ ...income, frequency })}
							>
								<SelectTrigger className="col-span-3">
									<SelectValue placeholder="Select frequency" />
								</SelectTrigger>

								<SelectContent>
									{FREQUENCIES.map(frequency => (
										<SelectItem key={frequency} value={frequency}>
											{capitalize(frequency)}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</fieldset>
					</div>

					<DialogFooter>
						<Button type="submit">Add Income</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	)
}
