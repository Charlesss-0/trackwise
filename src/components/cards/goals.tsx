'use client'

import AddGoal from '@/components/dialogs/add-goal'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useState } from 'react'

export default function Goals(): React.ReactNode {
	const [addGoalOpen, setAddGoalOpen] = useState<boolean>(false)

	return (
		<>
			<Card className="relative h-max">
				<h2 className="text-lg font-medium text-neutral">Goals</h2>
				<div className="flex flex-col items-center justify-center h-full mb-6">
					<p className="text-sm font-medium text-neutral">No goals set yet.</p>
					<Button variant="outline" className="mt-4" onClick={() => setAddGoalOpen(true)}>
						Add Goal
					</Button>
				</div>
			</Card>
			<AddGoal open={addGoalOpen} onOpenChange={setAddGoalOpen} />
		</>
	)
}
