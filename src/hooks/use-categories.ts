import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import type { Category, NewCategory } from "@/types/database";

export function useCategories() {
	return useQuery({
		queryKey: ["categories"],
		queryFn: async (): Promise<Category[]> => {
			const supabase = createClient();
			const { data, error } = await supabase.from("categories").select("*").order("name", { ascending: true });

			if (error) throw error;
			return data ?? [];
		},
	});
}

export function useCreateCategory() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (category: NewCategory) => {
			const supabase = createClient();
			const { data, error } = await supabase.from("categories").insert(category).select().single();

			if (error) throw error;
			return data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["categories"] });
		},
	});
}

export function useUpdateCategory() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({ id, ...updates }: { id: string; name: string; icon: string; color: string }) => {
			const supabase = createClient();
			const { data, error } = await supabase.from("categories").update(updates).eq("id", id).select().single();

			if (error) throw error;
			return data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["categories"] });
		},
	});
}

export function useDeleteCategory() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (id: string) => {
			const supabase = createClient();
			const { error } = await supabase.from("categories").delete().eq("id", id);

			if (error) throw error;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["categories"] });
		},
	});
}
