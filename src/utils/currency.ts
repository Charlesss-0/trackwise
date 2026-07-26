import type { Account, Currency } from "@/types";

const SYMBOLS: Record<Currency, string> = {
	NIO: "C$",
	USD: "$",
};

/**
 * Format a numeric amount with the appropriate currency symbol.
 *
 * @example
 * formatCurrency(1500.5, "NIO") // "C$1,500.50"
 * formatCurrency(42, "USD")     // "$42.00"
 */
export function formatCurrency(amount: number, currency: Currency | undefined): string {
	const formatted = new Intl.NumberFormat("en-US", {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	}).format(Math.abs(amount));

	const sign = amount < 0 ? "-" : "";
	return `${sign}${SYMBOLS[currency ?? "USD"]}${formatted}`;
}

/**
 * Convert an amount between NIO and USD.
 *
 * @param amount - The value to convert.
 * @param from   - Source currency.
 * @param to     - Target currency.
 * @param rate   - How many NIO equal 1 USD (e.g. 36.5).
 * @returns The converted amount (rounded to 2 decimals).
 *
 * @example
 * convertCurrency(100, "USD", "NIO", 36.5) // 3650
 * convertCurrency(3650, "NIO", "USD", 36.5) // 100
 */
export function convertCurrency(amount: number, from: Currency, to: Currency, rate: number): number {
	if (from === to) return amount;

	// from USD → NIO: multiply by rate
	// from NIO → USD: divide by rate
	const converted = from === "USD" ? amount * rate : amount / rate;
	return Math.round(converted * 100) / 100;
}

/**
 * For credit card accounts, compute the amount owed from credit_limit and available_balance.
 * Returns 0 for non-credit accounts or if fields are missing.
 */
export function getAmountOwed(account: Account): number {
	if (account.type !== "credit" || account.credit_limit == null || account.available_balance == null) {
		return 0;
	}
	return account.credit_limit - account.available_balance;
}
