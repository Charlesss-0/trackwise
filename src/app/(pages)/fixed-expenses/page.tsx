'use client'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'

import AddFixedExpense from '@/pages/fixed-expenses/_components/add-fixed-expense-dialog'
import { Button } from '@/components/ui/button'
import UpdateFixedExpense from '@/pages/fixed-expenses/_components/update-fixed-expense-dialog'
import EmptyState from '@/components/shared/empty-state'
import FixedExpenseItem from '@/pages/fixed-expenses/_components/fixed-expense-item'
import { Plus } from 'lucide-react'
import { useExpenseStore } from '@/stores/expenses-store'
import { useFixedExpenseStore } from '@/stores/fixed-expenses-store'
import { type JSX, useState } from 'react'
import PageHeader from '@/components/shared/page-header'
import HeaderStats from '@/pages/fixed-expenses/_components/header-stats'

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
			<PageHeader title="Fixed Expenses" description="Manage your recurring expenses" />

			<div className="flex flex-col gap-4">
				<Button className="self-end" onClick={() => openModal('add')}>
					<Plus className="w-5 h-5" />

					<span>Add Fixed Expense</span>
				</Button>

				<HeaderStats />
			</div>

			<div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-4">
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
			</div>

			<AddFixedExpense
				open={modalState === 'add'}
				onOpenChange={isOpen => (isOpen ? openModal('add') : closeModal())}
			/>

			{selectedExpenseId && (
				<>
					<UpdateFixedExpense
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
