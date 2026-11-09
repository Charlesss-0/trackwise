import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import type { Account, AccountUpdate, NewAccount } from "@/types";

const supabase = createClient();

export function useAccounts() {
	return useQuery({
		queryKey: ["accounts"],
		queryFn: async ({ signal }): Promise<Account[]> => {
			const { data, error } = await supabase
				.from("accounts")
				.select("*")
				.order("sort_order", { ascending: true })
				.order("created_at", { ascending: true })
				.order("id", { ascending: true })
				.abortSignal(signal);

			if (error) throw error;
			return data ?? [];
		},
	});
}

export function useCreateAccount() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (account: NewAccount) => {
			const { data, error } = await supabase.from("accounts").insert(account).select().single();

			if (error) throw error;
			return data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["accounts"] });
		},
	});
}

export function useUpdateAccount() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({ id, ...updates }: AccountUpdate & { id: string }) => {
			const { data, error } = await supabase.from("accounts").update(updates).eq("id", id).select().single();

			if (error) throw error;
			return data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["accounts"] });
		},
	});
}

export function useDeleteAccount() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (id: string) => {
			const { error } = await supabase.from("accounts").delete().eq("id", id);

			if (error) throw error;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["accounts"] });
		},
	});
}
