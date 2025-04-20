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

import { Button } from './ui/button'

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
					<div>
						<fieldset>
							<label htmlFor="amount">Amount</label>
							<input type="number" id="amount" name="amount" placeholder="0.00" required />
						</fieldset>
						<fieldset>
							<label htmlFor="type">Type</label>
							<Select>
								<SelectTrigger>
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
						<fieldset>
							<label htmlFor="frequency">Frequency</label>
							<Select>
								<SelectTrigger>
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
						<Button type="submit">Add Income</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	)
}
