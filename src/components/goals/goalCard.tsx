'use client'

import AddGoal from '@/components/goals/addGoalDialog'
import { Button } from '../ui/button'
import { Card } from '@/components/ui/card'
import EmptyState from '../shared/emptyState'
import GoalItem from './goalItem'
import { Plus } from 'lucide-react'
import { useGoalStore } from '@/stores/goals-store'
import { useState } from 'react'

export default function GoalCard(): React.ReactNode {
	const { goals } = useGoalStore()
	const [modalState, setModalState] = useState<'add' | 'edit' | 'delete' | 'contribution' | null>(
		null
	)

	const openModal = (state: typeof modalState): void => {
		setModalState(state)
	}

	const closeModal = (): void => {
		setModalState(null)
	}

	return (
		<>
			<Card className="relative max-h-[400px] h-full">
				<h2 className="text-lg font-medium text-neutral">Goals</h2>
				<div className="h-full space-y-4 overflow-y-auto rounded-md scrollbar-hide">
					{goals.length > 0 ? (
						goals.map(goal => <GoalItem key={goal.id} goal={goal} />)
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
						className="absolute right-4 top-4 hover:bg-base-300 dark:hover:bg-base-300-dark"
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
		</>
	)
}
