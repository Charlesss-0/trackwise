import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { useExchangeRateStore } from "@/stores/exchange-rate-store";

export function useExchangeRate() {
  return useQuery({
    queryKey: ["exchange-rate"],
    queryFn: async () => {
      const supabase = createClient();

      // First check for a manual rate in Supabase
      const { data: manualRate } = await supabase
        .from("exchange_rates")
        .select("*")
        .eq("is_manual", true)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (manualRate) {
        const store = useExchangeRateStore.getState();
        store.setManualRate(manualRate.rate as number);
        return manualRate.rate as number;
      }

      // Otherwise fetch from API
      const response = await fetch("/api/exchange-rate");
      if (!response.ok) throw new Error("Failed to fetch exchange rate");
      const json = await response.json();
      const apiRate = json.rate as number;

      const store = useExchangeRateStore.getState();
      store.setRate(apiRate);
      return apiRate;
    },
    staleTime: 1000 * 60 * 30, // 30 minutes
  });
}

export function useSetManualRate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (rate: number) => {
      const supabase = createClient();

      const { data, error } = await supabase
        .from("exchange_rates")
        .insert({
          rate,
          is_manual: true,
          base_currency: "USD",
          target_currency: "NIO",
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      const store = useExchangeRateStore.getState();
      store.setManualRate(data.rate as number);
      queryClient.invalidateQueries({ queryKey: ["exchange-rate"] });
    },
  });
}
