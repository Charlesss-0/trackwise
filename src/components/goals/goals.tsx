'use client'

import { Card, CardHeader } from '@/components/ui/card'

import AddGoal from '@/components/goals/addGoalDialog'
import EmptyState from '../shared/emptyState'
import { useGoalStore } from '@/stores/goals-store'
import { useState } from 'react'

export default function Goals(): React.ReactNode {
	const { goals } = useGoalStore()
	const [addGoalOpen, setAddGoalOpen] = useState<boolean>(false)

	return (
		<>
			<Card className="relative max-h-[400px] h-full">
				<h2 className="text-lg font-medium text-neutral">Goals</h2>
				<div className="h-full space-y-4 overflow-y-auto rounded-md scrollbar-hide">
					{goals.length > 0 ? (
						goals.map(goal => (
							<Card key={goal.id} className="rounded-md bg-base-100 dark:bg-base-100-dark">
								<CardHeader className="flex justify-between">
									<div>
										<span className="text-base-content dark:text-base-content-dark">
											{goal.name}
										</span>
									</div>
								</CardHeader>
							</Card>
						))
					) : (
						<EmptyState
							message="No goals set yet."
							btnText="Add Goal"
							onClick={() => setAddGoalOpen(true)}
						/>
					)}
				</div>
			</Card>
			<AddGoal open={addGoalOpen} onOpenChange={setAddGoalOpen} />
		</>
	)
}
