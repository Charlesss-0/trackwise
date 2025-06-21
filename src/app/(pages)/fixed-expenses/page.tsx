'use client'

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'

import AddFixedExpense from '@/components/fixed-expenses/add-fixed-expense-dialog'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import EditFixedExpense from '@/components/fixed-expenses/update-fixed-expense-dialog'
import EmptyState from '@/components/empty-state'
import FixedExpenseItem from '@/components/fixed-expenses/fixed-expense-item'
import { Plus } from 'lucide-react'
import { useExpenseStore } from '@/stores/expenses-store'
import { useFixedExpenseStore } from '@/stores/fixed-expenses-store'
import { type JSX, useState } from 'react'

export default function FixedExpenseCard(): JSX.Element {
	const { fixedExpenses, deleteFixedExpense, updateFixedExpense } = useFixedExpenseStore()
	const { addExpense, deleteExpense } = useExpenseStore()
	const [selectedExpenseId, setSelectedExpenseId] = useState<string | null>(null)
	const [modalState, setModalState] = useState<'add' | 'edit' | 'delete' | 'payment' | null>(null)
	const [amount, setAmount] = useState<string>('')

	const openModal = (state: typeof modalState, id?: string): void => {
		setSelectedExpenseId(id || null)
		setModalState(state)
	}

	const closeModal = (): void => {
		setSelectedExpenseId(null)
		setModalState(null)
		setAmount('')
	}

	const handlePaymentSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
		e.preventDefault()

		const expense = fixedExpenses.find(exp => exp.id === selectedExpenseId)
		if (!expense) return

		let newAmount = Number(amount)

		addExpense({
			id: expense.id,
			name: expense.name,
			amount: newAmount,
			category: expense.category,
			createdAt: Date.now(),
			paymentMethod: 'unknown',
		})

		if (expense.currentAmount) {
			newAmount += expense.currentAmount

			if (newAmount > expense.targetAmount) {
				alert('You cannot pay more than the target amount.')
				closeModal()
				return
			}
		}

		updateFixedExpense(selectedExpenseId as string, {
			...expense,
			currentAmount: newAmount,
			isPaid: newAmount === expense.targetAmount,
		})

		closeModal()
	}

	return (
		<>
			<Card className="relative max-h-[400px] h-full w-full">
				<h2 className="text-sm font-medium md:text-lg text-neutral">Fixed Expenses</h2>
				<div className="h-full space-y-4 overflow-y-auto rounded-md scrollbar-hide">
					{fixedExpenses.length > 0 ? (
						fixedExpenses.map(expense => (
							<FixedExpenseItem
								key={expense.id}
								expense={expense}
								onEdit={() => openModal('edit', expense.id)}
								onDelete={() => openModal('delete', expense.id)}
								onAddPayment={() => openModal('payment', expense.id)}
							/>
						))
					) : (
						<EmptyState
							message="No fixed expenses set yet."
							btnText="Add Fixed Expense"
							onClick={() => openModal('add')}
						/>
					)}

					{fixedExpenses.length > 0 && (
						<Button
							variant="ghost"
							size="icon"
							className="absolute right-4 top-4 hover:bg-base-300"
							onClick={() => openModal('add')}
						>
							<Plus size={16} />
						</Button>
					)}
				</div>
			</Card>

			<AddFixedExpense
				open={modalState === 'add'}
				onOpenChange={isOpen => (isOpen ? openModal('add') : closeModal())}
			/>
			{selectedExpenseId && (
				<>
					<EditFixedExpense
						id={selectedExpenseId}
						open={modalState === 'edit'}
						onOpenChange={isOpen => (isOpen ? openModal('edit', selectedExpenseId) : closeModal())}
					/>

					<Dialog
						open={modalState === 'delete'}
						onOpenChange={isOpen =>
							isOpen ? openModal('delete', selectedExpenseId) : closeModal()
						}
					>
						<DialogContent>
							<DialogTitle className="text-sm font-medium text-base-content">
								Are you sure you want to delete this fixed expense?
							</DialogTitle>
							<div className="flex justify-end gap-4 mt-4">
								<Button variant="secondary" onClick={closeModal}>
									Cancel
								</Button>
								<Button
									variant="destructive"
									onClick={() => {
										deleteFixedExpense(selectedExpenseId)
										deleteExpense(selectedExpenseId)
										closeModal()
									}}
								>
									Delete
								</Button>
							</div>
						</DialogContent>
					</Dialog>

					<Dialog
						open={modalState === 'payment'}
						onOpenChange={isOpen =>
							isOpen ? openModal('payment', selectedExpenseId) : closeModal()
						}
					>
						<DialogContent>
							<DialogHeader>
								<DialogTitle>Add Payment</DialogTitle>
								<DialogDescription>
									Enter the amount you want to pay for this expense.
								</DialogDescription>
							</DialogHeader>

							<form className="flex flex-col gap-4" onSubmit={handlePaymentSubmit}>
								<input
									type="number"
									value={amount}
									onChange={e => setAmount(e.target.value)}
									placeholder="Enter amount"
									className="input"
								/>
								<div className="flex justify-end gap-2">
									<Button variant="outline" type="button" onClick={closeModal}>
										Cancel
									</Button>
									<Button type="submit" variant="secondary">
										Pay
									</Button>
								</div>
							</form>
						</DialogContent>
					</Dialog>
				</>
			)}
		</>
	)
}
