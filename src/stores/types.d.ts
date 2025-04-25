type Income = {
	id: string
	amount: number
	type: string
	frequency: string
	timestamp: number
}

type Expense = {
	id: string
	name: string
	amount: number
	category: string
	paymentMethod: string
	timestamp: number
}

type FixedExpense = Omit<Expense, 'paymentMethod' | 'amount'> & {
	targetAmount: number
	currentAmount: number
	dueDate: number
	frequency: string
}

type Contribution = {
	id: string
	amount: number
	timestamp: number
}

type Goal = {
	id: string
	name: string
	targetAmount: number
	currentAmount: number
	deadline: number
	priority: string
	contributions?: Contribution[]
	timestamp: number
}

type Transaction = {
	id: string
	name: string
	timestamp: number
	category: string
	amount: number
	isExpense: boolean
}
