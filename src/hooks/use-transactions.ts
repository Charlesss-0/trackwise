import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { endOfMonth, parseISO, startOfMonth } from "date-fns";
import { createClient } from "@/lib/supabase/client";
import { useExchangeRateStore } from "@/stores/exchange-rate-store";
import type { AccountUpdate, Category, Currency, NewTransaction, Transaction, TransactionWithRelations, TxnType } from "@/types";
import { convertCurrency } from "@/utils/currency";

type TransactionFilters = {
  accountId?: string;
  categoryId?: string;
  type?: TxnType;
  startDate?: string;
  endDate?: string;
  limit?: number;
};

const supabase = createClient();

export function useTransactions(filters?: TransactionFilters) {
  const query = useQuery({
    queryKey: ["transactions", filters],
    queryFn: async (): Promise<TransactionWithRelations[]> => {
      let query = supabase
        .from("transactions")
        .select("*, account:accounts(name, currency), category:categories(name, color, icon)")
        .order("date", { ascending: false });

      if (filters?.accountId) {
        query = query.eq("account_id", filters.accountId);
      }

      if (filters?.categoryId) {
        query = query.eq("category_id", filters.categoryId);
      }

      if (filters?.type) {
        query = query.eq("type", filters.type);
      }

      if (filters?.startDate) {
        query = query.gte("date", filters.startDate);
      }

      if (filters?.endDate) {
        query = query.lte("date", filters.endDate);
      }

      if (filters?.limit) {
        query = query.limit(filters.limit);
      }

      const { data, error } = await query;

      if (error) throw error;

      return data ?? [];
    },
  });

  return query;
}

export function useCreateTransaction() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (transaction: NewTransaction) => {
      const { data, error } = await supabase.from("transactions").insert(transaction).select().single();

      if (error) throw error;

      const { data: account } = await supabase
        .from("accounts")
        .select("balance, currency, type, credit_limit, available_balance")
        .eq("id", transaction.account_id)
        .single();

      if (!account) throw new Error("Account not found");

      const rate = useExchangeRateStore.getState().rate ?? 36.5;
      const convertedAmount = convertCurrency(transaction.amount, transaction.currency as Currency, account.currency, rate);

      const balanceChange = transaction.type === "income" ? convertedAmount : -convertedAmount;

      if (account.type === "credit" && account.credit_limit != null && account.available_balance != null) {
        const newAvailableBalance = Math.max(0, account.available_balance - balanceChange);
        const newBalance = account.credit_limit - newAvailableBalance;

        await supabase
          .from("accounts")
          .update({
            available_balance: newAvailableBalance,
            balance: newBalance,
          })
          .eq("id", transaction.account_id);
      } else {
        const { error: balanceError } = await supabase.rpc("update_account_balance", {
          p_account_id: transaction.account_id,
          p_amount: balanceChange,
        });

        if (balanceError) {
          await supabase
            .from("accounts")
            .update({ balance: account.balance + balanceChange } as AccountUpdate)
            .eq("id", transaction.account_id);
        }
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
    },
  });

  return mutation;
}

export function useUpdateTransaction() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async ({ id, ...updates }: NewTransaction & { id: string }) => {
      const { data, error } = await supabase.from("transactions").update(updates).eq("id", id).select().single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
    },
  });

  return mutation;
}

export function useDeleteTransaction() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (transaction: Transaction) => {
      const { data: account } = await supabase
        .from("accounts")
        .select("balance, currency, type, credit_limit, available_balance")
        .eq("id", transaction.account_id)
        .single();

      if (!account) throw new Error("Account not found");

      const rate = useExchangeRateStore.getState().rate ?? 36.5;
      const convertedAmount = convertCurrency(transaction.amount, transaction.currency, account.currency, rate);

      const balanceChange = transaction.type === "income" ? -convertedAmount : convertedAmount;

      if (account.type === "credit" && account.credit_limit != null && account.available_balance != null) {
        const newAvailableBalance = Math.min(account.credit_limit, account.available_balance - balanceChange);
        const newBalance = account.credit_limit - newAvailableBalance;

        await supabase
          .from("accounts")
          .update({
            available_balance: newAvailableBalance,
            balance: newBalance,
          })
          .eq("id", transaction.account_id);
      } else {
        await supabase
          .from("accounts")
          .update({ balance: account.balance + balanceChange })
          .eq("id", transaction.account_id);
      }

      const { error } = await supabase.from("transactions").delete().eq("id", transaction.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
    },
  });

  return mutation;
}

export function useRecurringTransactions() {
  const query = useQuery({
    queryKey: ["transactions", "recurring"],
    queryFn: async (): Promise<TransactionWithRelations[]> => {
      const { data, error } = await supabase
        .from("transactions")
        .select("*, account:accounts(name, currency), category:categories(name, color, icon)")
        .eq("is_recurring", true)
        .order("recurring_due_day", { ascending: true });

      if (error) throw error;
      return data ?? [];
    },
  });

  return query;
}

type CategoryBreakdownItem = Pick<Category, "id" | "name" | "color"> & {
  total: number;
};

export function useCategoryBreakdown(month: string) {
  const query = useQuery({
    queryKey: ["transactions", "breakdown", month],
    queryFn: async (): Promise<CategoryBreakdownItem[]> => {
      const date = parseISO(`${month}-01`);
      const start = startOfMonth(date).toISOString().split("T")[0];
      const end = endOfMonth(date).toISOString().split("T")[0];

      const { data, error } = await supabase
        .from("transactions")
        .select("amount, category:categories(id, name, color)")
        .eq("type", "expense")
        .gte("date", start)
        .lte("date", end);

      if (error) throw error;

      const grouped = new Map<string, { name: string; color: string; total: number }>();

      for (const tx of data ?? []) {
        const cat = tx.category;
        if (!cat) continue;

        const existing = grouped.get(cat.id);
        if (existing) {
          existing.total += tx.amount;
        } else {
          grouped.set(cat.id, {
            name: cat.name,
            color: cat.color,
            total: tx.amount,
          });
        }
      }

      return Array.from(grouped.entries()).map(([id, { name, color, total }]) => ({
        id,
        name,
        color,
        total,
      }));
    },
  });

  return query;
}
