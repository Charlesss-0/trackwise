import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'

import { Button } from '@/components/ui/button'
import { DEFAULT_CATEGORIES } from '@/data/default-categories'

export default function AddFixedExpense({
	open,
	onOpenChange,
}: {
	open: boolean
	onOpenChange: (open: boolean) => void
}): React.ReactNode {
	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Add Fixed Expense</DialogTitle>
					<DialogDescription>
						Add a recurring expense with target amount and due date
					</DialogDescription>
				</DialogHeader>
				<form>
					<div className="grid gap-4 py-2 my-6 ">
						<fieldset className="grid items-center grid-cols-4 gap-2">
							<label htmlFor="name" className="text-right">
								Name
							</label>
							<input
								type="text"
								id="name"
								name="name"
								required
								autoComplete="off"
								className="col-span-3 input"
							/>
						</fieldset>
						<fieldset className="grid items-center grid-cols-4 gap-2">
							<label htmlFor="target" className="text-right">
								Target Amount
							</label>
							<input
								type="number"
								id="target"
								name="target"
								placeholder="0.00"
								required
								className="col-span-3 input"
							/>
						</fieldset>
						<fieldset className="grid items-center grid-cols-4 gap-2">
							<label htmlFor="category" className="text-right">
								Category
							</label>
							<Select>
								<SelectTrigger className="col-span-3">
									<SelectValue placeholder="Select category" />
								</SelectTrigger>
								<SelectContent>
									{DEFAULT_CATEGORIES.map(category => (
										<SelectItem key={category} value={category}>
											{category.charAt(0).toUpperCase() + category.slice(1)}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</fieldset>
						<fieldset className="grid items-center grid-cols-4 gap-2">
							<label htmlFor="dueDate" className="text-right">
								Due Date
							</label>
							<input type="date" id="dueDate" name="due_date" className="col-span-3 input" />
						</fieldset>
						<fieldset className="grid items-center grid-cols-4 gap-2">
							<label htmlFor="frequency" className="text-right">
								Frequency
							</label>
							<Select>
								<SelectTrigger className="col-span-3">
									<SelectValue placeholder="Select frequency" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="monthly">Monthly</SelectItem>
									<SelectItem value="quarterly">Quarterly</SelectItem>
									<SelectItem value="annually">Annually</SelectItem>
								</SelectContent>
							</Select>
						</fieldset>
					</div>
					<DialogFooter>
						<Button type="submit" variant="secondary">
							Add Fixed Expense
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	)
}
