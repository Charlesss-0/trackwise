import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { FileText, Trash2 } from 'lucide-react'
import { type JSX } from 'react'

export default function NotesList(): JSX.Element {
	return (
		<div className="flex flex-col gap-2">
			<div className="flex items-center gap-2">
				<FileText />

				<span className="text-2xl font-bold">Notes</span>
			</div>

			<Card className="bg-white border-l-4 border-r-0 rounded-md shadow-sm border-y-0 border-l-info">
				<div className="flex items-center justify-between">
					<div className="flex flex-col gap-1">
						<span className="text-base-content">Take out the trash</span>
					</div>

					<Button
						variant="ghost"
						size="icon"
						className="hover:bg-base-200 dark:hover:bg-base-300 size-9"
					>
						<Trash2 className="text-red-400" />

						<span className="sr-only">Delete</span>
					</Button>
				</div>
			</Card>
		</div>
	)
}
