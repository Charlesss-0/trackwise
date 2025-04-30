type Income = {
	id: string
	amount: number
	type: string
	frequency: string
	createdAt: number
}

type Expense = {
	id: string
	name: string
	amount: number
	category: string
	paymentMethod: string
	createdAt: number
}

type FixedExpense = Omit<Expense, 'paymentMethod' | 'amount'> & {
	targetAmount: number
	currentAmount: number
	dueDate: string
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
	amount: number
	isExpense: boolean
	createdAt: number
}
