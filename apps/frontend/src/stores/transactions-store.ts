import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type State = {
	transactions: Transaction[]
}

type Actions = {
	addTransaction: (transaction: Transaction) => void
	deleteTransaction: (id: string) => void
	updateTransaction: (id: string, transaction: Transaction) => void
}

type TransactionStore = State & Actions

export const useTransactionsStore = create(
	persist<TransactionStore>(
		set => ({
			transactions: [],
			addTransaction: (transaction: Transaction): void =>
				set(state => ({ ...state, transactions: [...state.transactions, transaction] })),
			deleteTransaction: (id: string): void =>
				set(state => ({
					...state,
					transactions: state.transactions.filter(transaction => transaction.id !== id),
				})),
			updateTransaction: (id: string, transaction: Transaction): void =>
				set(state => ({
					...state,
					transactions: state.transactions.map(item => (item.id === id ? transaction : item)),
				})),
		}),
		{
			name: 'transactions-store',
		}
	)
)
