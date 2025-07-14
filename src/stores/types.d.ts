type Income = {
	id: string
	amount: string
	type: string
	frequency: string
	createdAt: number
}

type Expense = {
	id: string
	name: string
	amount: string
	category: string
	paymentMethod: string
	createdAt: number
}

type FixedExpense = Omit<Expense, 'paymentMethod' | 'amount'> & {
	targetAmount: number
	currentAmount: number
	isRecurring: boolean
	frequency: string
	isPaid: boolean
}

type Contribution = {
	id: string
	amount: number
	createdAt: number
}

type Goal = {
	id: string
	name: string
	targetAmount: number
	currentAmount: number
	deadline: string
	priority: string
	monthlyContribution: number
	isPaid: boolean
	contributions?: Contribution[]
	createdAt: number
}

type Transaction = {
	id: string
	name: string
	category: string
	amount: string
	isExpense: boolean
	createdAt: number
}

type Note = {
	id: string
	title: string
	content: string
	createdAt: number
}

type Reminder = Note & {
	id: string
	dueDate: string
	recurring: boolean
	recurringFrequency: string
	createdAt: number
}

type BudgetCategory = {
	id: string
	name: string
	budgetAmount: string
	spentAmount: string
	createdAt: number
}
