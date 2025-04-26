'use client'

import { Card, CardHeader } from '@/components/ui/card'

import AddGoal from '@/components/dialogs/add-goal'
import { Button } from '@/components/ui/button'
import { useGoalStore } from '@/stores/goals-store'
import { useState } from 'react'

export default function Goals(): React.ReactNode {
	const { goals } = useGoalStore()
	const [addGoalOpen, setAddGoalOpen] = useState<boolean>(false)

	return (
		<>
			<Card className="relative max-h-[400px]">
				<h2 className="text-lg font-medium text-neutral">Goals</h2>
				<div className="h-full overflow-y-auto space-y-4 scrollbar-hide rounded-md">
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
						<div className="flex flex-col items-center justify-center h-full mb-6">
							<p className="text-sm font-medium text-neutral">No goals set yet.</p>
							<Button variant="outline" className="mt-4" onClick={() => setAddGoalOpen(true)}>
								Add Goal
							</Button>
						</div>
					)}
				</div>
			</Card>
			<AddGoal open={addGoalOpen} onOpenChange={setAddGoalOpen} />
		</>
	)
}
