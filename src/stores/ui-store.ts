import { create } from "zustand";
import type { Currency } from "@/types";

interface UIState {
	homeCurrency: Currency;
	setHomeCurrency: (currency: Currency) => void;

	sidebarOpen: boolean;
	toggleSidebar: () => void;

	activeModal: string | null;
	openModal: (modalId: string) => void;
	closeModal: () => void;
}

export const useUIStore = create<UIState>((set) => ({
	homeCurrency: "USD",
	setHomeCurrency: (currency) => set({ homeCurrency: currency }),

	sidebarOpen: false,
	toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),

	activeModal: null,
	openModal: (modalId) => set({ activeModal: modalId }),
	closeModal: () => set({ activeModal: null }),
}));
