'use client'

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'

import AddGoal from '@/pages/goals/_components/add-goal-dialog'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import EmptyState from '@/components/shared/empty-state'
import GoalInfo from '@/pages/goals/_components/goal-info'
import GoalItem from '@/pages/goals/_components/goal-item'
import { Plus } from 'lucide-react'
import UpdateGoal from '@/pages/goals/_components/update-goal'
import { useExpenseStore } from '@/stores/expenses-store'
import { useGoalStore } from '@/stores/goals-store'
import { type JSX, useState } from 'react'

export default function GoalCard(): JSX.Element {
	const { goals, updateGoal, deleteGoal } = useGoalStore()
	const { addExpense, deleteExpense } = useExpenseStore()
	const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null)
	const [amount, setAmount] = useState<string>('')
	const [modalState, setModalState] = useState<
		'add' | 'edit' | 'delete' | 'contribute' | 'info' | null
	>(null)

	const openModal = (state: typeof modalState, id?: string): void => {
		setSelectedGoalId(id || null)
		setModalState(state)
	}

	const closeModal = (): void => {
		setModalState(null)
	}

	const handleContributeSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
		e.preventDefault()

		const goal = goals.find(goal => goal.id === selectedGoalId)
		if (!goal) return

		let newAmount = Number(amount)

		addExpense({
			id: goal.id,
			name: goal.name,
			amount: newAmount,
			category: 'goal',
			createdAt: Date.now(),
			paymentMethod: 'unknown',
		})

		if (goal.currentAmount) {
			newAmount += goal.currentAmount

			if (newAmount > goal.targetAmount) {
				alert('You cannot contribute more than the target amount.')
				closeModal()
				return
			}
		}

		updateGoal(selectedGoalId as string, {
			...goal,
			currentAmount: newAmount,
			isPaid: newAmount === goal.targetAmount,
		})

		closeModal()
		setAmount('')
	}

	return (
		<>
			<Card className="relative max-h-[400px] h-full">
				<h2 className="text-sm font-medium md:text-lg text-neutral">Goals</h2>
				<div className="h-full space-y-4 overflow-y-auto rounded-md scrollbar-hide">
					{goals.length > 0 ? (
						goals.map(goal => (
							<GoalItem
								key={goal.id}
								goal={goal}
								onEdit={() => openModal('edit', goal.id)}
								onInfo={() => openModal('info', goal.id)}
								onContribute={() => openModal('contribute', goal.id)}
							/>
						))
					) : (
						<EmptyState
							message="No goals set yet."
							btnText="Add Goal"
							onClick={() => setModalState('add')}
						/>
					)}
				</div>

				{goals.length > 0 && (
					<Button
						variant="ghost"
						size="icon"
						className="absolute right-4 top-4 hover:bg-base-300"
						onClick={() => openModal('add')}
					>
						<Plus size={16} />
					</Button>
				)}
			</Card>

			<AddGoal
				open={modalState === 'add'}
				onOpenChange={isOpen => (isOpen ? openModal('add') : closeModal())}
			/>
			{selectedGoalId && (
				<>
					<UpdateGoal
						id={selectedGoalId}
						open={modalState === 'edit'}
						onOpenChange={isOpen => (isOpen ? openModal('edit', selectedGoalId) : closeModal())}
					/>

					<Dialog
						open={modalState === 'delete'}
						onOpenChange={isOpen => (isOpen ? openModal('delete', selectedGoalId) : closeModal())}
					>
						<DialogContent>
							<DialogTitle className="text-sm font-medium text-base-content">
								Are you sure you want to delete this goal?
							</DialogTitle>
							<div className="flex justify-end gap-4 mt-4">
								<Button variant="secondary" onClick={closeModal}>
									Cancel
								</Button>
								<Button
									variant="destructive"
									onClick={() => {
										deleteGoal(selectedGoalId)
										deleteExpense(selectedGoalId)
										closeModal()
									}}
								>
									Delete
								</Button>
							</div>
						</DialogContent>
					</Dialog>

					<Dialog
						open={modalState === 'contribute'}
						onOpenChange={isOpen =>
							isOpen ? openModal('contribute', selectedGoalId) : closeModal()
						}
					>
						<DialogContent>
							<DialogHeader>
								<DialogTitle>Contribute to Goal</DialogTitle>
								<DialogDescription>
									Enter the amount you want to contribute to this goal.
								</DialogDescription>
							</DialogHeader>

							<form className="flex flex-col gap-4" onSubmit={handleContributeSubmit}>
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
										Contribute
									</Button>
								</div>
							</form>
						</DialogContent>
					</Dialog>

					<GoalInfo
						selectedGoalId={selectedGoalId as string}
						open={modalState === 'info'}
						onOpenChange={isOpen => (isOpen ? openModal('info', selectedGoalId) : closeModal())}
						deleteGoal={deleteGoal}
						deleteExpense={deleteExpense}
						closeModal={closeModal}
					/>
				</>
			)}
		</>
	)
}
