import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import type { Debt, DebtUpdate, NewDebt } from "@/types/database";

export function useDebts() {
	return useQuery({
		queryKey: ["debts"],
		queryFn: async (): Promise<Debt[]> => {
			const supabase = createClient();
			const { data, error } = await supabase.from("debts").select("*").order("created_at", { ascending: true });

			if (error) throw error;
			return data ?? [];
		},
	});
}

export function useCreateDebt() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (debt: NewDebt) => {
			const supabase = createClient();
			const { data, error } = await supabase.from("debts").insert(debt).select().single();

			if (error) throw error;
			return data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["debts"] });
		},
	});
}

export function useUpdateDebt() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({ id, ...updates }: DebtUpdate & { id: string }) => {
			const supabase = createClient();
			const { data, error } = await supabase.from("debts").update(updates).eq("id", id).select().single();

			if (error) throw error;
			return data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["debts"] });
		},
	});
}

export function useDeleteDebt() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (id: string) => {
			const supabase = createClient();
			const { error } = await supabase.from("debts").delete().eq("id", id);

			if (error) throw error;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["debts"] });
		},
	});
}
