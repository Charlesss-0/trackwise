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

import { Button } from '../ui/button'

export default function AddIncome({
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
					<DialogTitle>Add Income</DialogTitle>
					<DialogDescription>
						Add your income details. You can specify the type and frequency of your income.
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
							<label htmlFor="type" className="text-right">
								Type
							</label>
							<Select>
								<SelectTrigger className="col-span-3">
									<SelectValue placeholder="Select income type" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="salary">Salary</SelectItem>
									<SelectItem value="bonus">Bonus</SelectItem>
									<SelectItem value="investment">Investment</SelectItem>
									<SelectItem value="other">Other</SelectItem>
								</SelectContent>
							</Select>
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
									<SelectItem value="one-time">One-time</SelectItem>
								</SelectContent>
							</Select>
						</fieldset>
					</div>
					<DialogFooter>
						<Button type="submit" variant="secondary">
							Add Income
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	)
}
