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
import { DEFAULT_CATEGORIES } from '@/data/default-categories'

export default function AddExpense({
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
					<DialogTitle>Add Expense</DialogTitle>
					<DialogDescription>
						Add your expense details including category and payment method
					</DialogDescription>
				</DialogHeader>
				<form>
					<div className="grid gap-4 py-2 my-6">
						<fieldset className="grid items-center grid-cols-4 gap-2">
							<label htmlFor="amount" className="text-right">
								Amount
							</label>
							<input
								type="number"
								id="amount"
								name="amount"
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
							<label htmlFor="payment_method" className="text-right">
								Payment Method
							</label>
							<Select>
								<SelectTrigger className="col-span-3">
									<SelectValue placeholder="Select payment method" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="credit">Credit Card</SelectItem>
									<SelectItem value="debit">Debit Card</SelectItem>
									<SelectItem value="cash">Cash</SelectItem>
									<SelectItem value="transfer">Bank Transfer</SelectItem>
								</SelectContent>
							</Select>
						</fieldset>
						<fieldset className="grid items-center grid-cols-4 gap-2">
							<label htmlFor="date" className="text-right">
								Date
							</label>
							<input type="date" id="date" name="date" className="col-span-3 input" />
						</fieldset>
					</div>
					<DialogFooter>
						<Button type="submit" variant="secondary">
							Add Expense
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	)
}
