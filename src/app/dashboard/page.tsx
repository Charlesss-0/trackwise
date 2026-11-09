"use client";

import { ArrowUpRight, CreditCard, Landmark, TrendingDown, TrendingUp, Wallet } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorNotice } from "@/components/ui/feedback";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { PageHeader } from "@/components/ui/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { useAccounts } from "@/hooks/use-accounts";
import { useDebts } from "@/hooks/use-debts";
import { useExchangeRate } from "@/hooks/use-exchange-rate";
import { useUIStore } from "@/stores/ui-store";
import { convertCurrency, formatCurrency, getAmountOwed } from "@/utils/currency";

export default function DashboardPage() {
	const { data: accounts = [], isLoading: accountsLoading, error: accountsError } = useAccounts();
	const { data: debts = [], isLoading: debtsLoading, error: debtsError } = useDebts();
	const { data: rate = 36.5 } = useExchangeRate();
	const homeCurrency = useUIStore((s) => s.homeCurrency);

	const totalAssets = accounts.reduce((acc, account) => {
		if (account.type === "credit") return acc;
		const amount = account.currency === homeCurrency ? account.balance : convertCurrency(account.balance, account.currency, homeCurrency, rate);
		return acc + amount;
	}, 0);

	const totalDebts =
		debts.reduce((acc, debt) => {
			const amount =
				debt.currency === homeCurrency ? debt.remaining_balance : convertCurrency(debt.remaining_balance, debt.currency, homeCurrency, rate);
			return acc + amount;
		}, 0) +
		accounts.reduce((acc, account) => {
			if (account.type !== "credit") return acc;
			const owed = getAmountOwed(account);
			const amount = account.currency === homeCurrency ? owed : convertCurrency(owed, account.currency, homeCurrency, rate);
			return acc + amount;
		}, 0);

	const netWorth = totalAssets - totalDebts;

	return (
		<div className="space-y-7">
			<PageHeader title="Your financial overview" description="A clear picture of where you stand. All your accounts, in one place.">
				<Button asChild variant="outline">
					<Link href="/dashboard/transactions">
						View transactions <ArrowUpRight />
					</Link>
				</Button>
			</PageHeader>

			<ErrorNotice error={accountsError || debtsError} />

			<div className="grid gap-4 md:grid-cols-3">
				<StatCard
					label="Net worth"
					value={accountsLoading || debtsLoading ? "—" : formatCurrency(netWorth, homeCurrency)}
					icon={<Wallet />}
					trend={netWorth >= 0 ? "positive" : "negative"}
					description={`Assets minus debts · ${homeCurrency}`}
					featured
				/>

				<StatCard
					label="Total assets"
					value={accountsLoading ? "—" : formatCurrency(totalAssets, homeCurrency)}
					icon={<TrendingUp />}
					trend="positive"
					description="Across your debit, cash & savings accounts"
				/>

				<StatCard
					label="Total debts"
					value={accountsLoading || debtsLoading ? "—" : formatCurrency(totalDebts, homeCurrency)}
					icon={<TrendingDown />}
					trend="negative"
					description="Loans and outstanding credit balances"
				/>
			</div>

			<div className="grid items-start gap-6 xl:grid-cols-[1.15fr_1fr]">
				<Card>
					<CardHeader>
						<div className="flex items-center gap-2.5">
							<CardTitle>Your accounts</CardTitle>

							<Badge>{accounts.length}</Badge>
						</div>

						<Button asChild variant="ghost" size="sm">
							<Link href="/dashboard/accounts">
								View all <ArrowUpRight />
							</Link>
						</Button>
					</CardHeader>

					<CardContent className="p-0 sm:p-0">
						{accountsLoading ? (
							<div className="p-12 text-center">
								<LoadingSpinner />
							</div>
						) : accounts.length === 0 ? (
							<EmptyState
								icon={Wallet}
								title="A home for every account"
								description="Add your bank accounts, savings, or cash to see your balances here."
							/>
						) : (
							<div className="divide-y divide-border">
								{accounts.slice(0, 5).map((acc) => {
									const isCredit = acc.type === "credit";
									const amountOwed = getAmountOwed(acc);
									return (
										<div key={acc.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-5 sm:px-6">
											<div className="flex min-w-0 items-center gap-3">
												<div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-border bg-muted text-muted-foreground">
													{isCredit ? <CreditCard size={18} /> : <Landmark size={18} />}
												</div>

												<div className="min-w-0">
													<p className="wrap-break-word font-medium">{acc.name}</p>

													<p className="mt-1 text-xs capitalize text-muted-foreground">
														{acc.type} <span className="mx-1.5">·</span> {acc.currency}
													</p>
												</div>
											</div>
											{isCredit ? (
												<div className="ml-auto text-right">
													<p className="font-semibold tabular-nums text-destructive">
														{formatCurrency(amountOwed, acc.currency)} <span className="text-xs font-normal">owed</span>
													</p>

													<p className="mt-1 text-xs tabular-nums text-muted-foreground">
														{formatCurrency(acc.available_balance ?? 0, acc.currency)} available
													</p>
												</div>
											) : (
												<p className="ml-auto font-semibold tabular-nums">{formatCurrency(acc.balance, acc.currency)}</p>
											)}
										</div>
									);
								})}
							</div>
						)}
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<div className="flex items-center gap-2.5">
							<CardTitle>Debts & loans</CardTitle>

							<Badge>{debts.length}</Badge>
						</div>

						<Button asChild variant="ghost" size="sm">
							<Link href="/dashboard/debts">
								View all <ArrowUpRight />
							</Link>
						</Button>
					</CardHeader>

					<CardContent className="p-0 sm:p-0">
						{debtsLoading ? (
							<div className="p-12 text-center">
								<LoadingSpinner />
							</div>
						) : debts.length === 0 ? (
							<EmptyState
								icon={CreditCard}
								title="No debts to keep track of"
								description="Any loans or debts you add will appear here, alongside their due dates."
							/>
						) : (
							<div className="divide-y divide-border">
								{debts.slice(0, 5).map((debt) => (
									<div key={debt.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-5 sm:px-6">
										<div className="flex min-w-0 items-center gap-3">
											<div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-destructive/5 text-destructive">
												<CreditCard size={18} />
											</div>

											<div>
												<p className="wrap-break-word font-medium">{debt.creditor_name}</p>

												<p className="mt-1 text-xs text-muted-foreground">
													Due day {debt.due_day} <span className="mx-1">·</span> {debt.currency}
												</p>
											</div>
										</div>

										<p className="ml-auto font-semibold tabular-nums">{formatCurrency(debt.remaining_balance, debt.currency)}</p>
									</div>
								))}
							</div>
						)}
					</CardContent>
				</Card>
			</div>

			<p className="flex items-center gap-2 text-xs text-muted-foreground">
				<span className="size-1.5 rounded-full bg-primary/60" />
				Overview totals are shown in {homeCurrency}. Individual accounts retain their own currency.
			</p>
		</div>
	);
}
