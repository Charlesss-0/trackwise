"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Account } from "@/types";

const accountsKey = ["accounts"] as const;
type OrderChange = { expectedIds: string[]; orderedIds: string[] };
const sameOrder = (a: string[], b: string[]) => a.length === b.length && a.every((id, index) => id === b[index]);

// Reorder only: keep the newest balances/details and any newly fetched accounts intact.
function applyOrder(accounts: Account[], ids: string[], positions?: Map<string, number>): Account[] {
	const rank = new Map(ids.map((id, index) => [id, index]));
	return [...accounts]
		.sort((a, b) => (rank.get(a.id) ?? ids.length) - (rank.get(b.id) ?? ids.length))
		.map((account) => ({ ...account, sort_order: positions?.get(account.id) ?? rank.get(account.id) ?? account.sort_order }));
}

export function useReorderAccounts() {
	const queryClient = useQueryClient();
	const busy = useRef(false);
	const mutation = useMutation({
		mutationKey: ["accounts", "reorder"],
		scope: { id: "account-order" },
		retry: false,
		// Fail offline instead of leaving an optimistic arrangement indefinitely queued.
		networkMode: "always",
		mutationFn: async ({ expectedIds, orderedIds }: OrderChange) => {
			const { error } = await createClient().rpc("reorder_accounts", { p_expected_ids: expectedIds, p_ordered_ids: orderedIds });
			if (error) throw new Error("Couldn't save account order. The previous order was restored. Please try again.");
		},
		onMutate: async ({ expectedIds, orderedIds }) => {
			await queryClient.cancelQueries({ queryKey: accountsKey });
			const previous = queryClient.getQueryData<Account[]>(accountsKey) ?? [];
			if (
				!sameOrder(
					previous.map((account) => account.id),
					expectedIds,
				)
			) {
				throw new Error("Your accounts changed while dragging. Please try again.");
			}
			queryClient.setQueryData(accountsKey, applyOrder(previous, orderedIds));
			return { previous };
		},
		onError: (_error, _variables, context) => {
			if (!context) return;
			const ids = context.previous.map((account) => account.id);
			const positions = new Map(context.previous.map((account) => [account.id, account.sort_order]));
			queryClient.setQueryData<Account[]>(accountsKey, (current) => applyOrder(current ?? context.previous, ids, positions));
		},
		// Keep handles locked through reconciliation, including conflicts from other tabs.
		onSettled: () => queryClient.invalidateQueries({ queryKey: accountsKey }),
	});

	async function reorder(change: OrderChange) {
		// Synchronous guard also catches a second drop before React renders pending state.
		if (busy.current || sameOrder(change.expectedIds, change.orderedIds)) return;
		busy.current = true;
		try {
			await mutation.mutateAsync(change);
		} catch {
			// React Query rolls back and exposes the error to the existing ErrorNotice.
		} finally {
			busy.current = false;
		}
	}

	return { reorder, isPending: mutation.isPending, error: mutation.error };
}
