import { create } from "zustand";

interface ExchangeRateState {
	/** Current NIO-per-USD rate (e.g. 36.5 means 1 USD = 36.5 NIO). */
	rate: number | null;

	/** Whether the rate was manually entered by the user. */
	isManual: boolean;

	/** When the rate was last fetched or set. */
	lastFetched: Date | null;

	/** Set the rate from an API fetch. */
	setRate: (rate: number) => void;

	/** Override the rate with a user-provided value. */
	setManualRate: (rate: number) => void;
}

export const useExchangeRateStore = create<ExchangeRateState>((set) => ({
	rate: null,
	isManual: false,
	lastFetched: null,

	setRate: (rate) =>
		set({
			rate,
			isManual: false,
			lastFetched: new Date(),
		}),

	setManualRate: (rate) =>
		set({
			rate,
			isManual: true,
			lastFetched: new Date(),
		}),
}));
