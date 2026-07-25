import type { Tables, TablesInsert, TablesUpdate } from "./supabase";

// ─── Row Types ─────────────────────────────

export type Account = Tables<"accounts">;

export type Category = Tables<"categories">;

export type Transaction = Tables<"transactions">;

export type Debt = Tables<"debts">;

export type ExchangeRate = Tables<"exchange_rates">;

// ─── Insert Types ─────────────────────────────

export type NewAccount = TablesInsert<"accounts">;

export type NewCategory = TablesInsert<"categories">;

export type NewTransaction = TablesInsert<"transactions">;

export type NewDebt = TablesInsert<"debts">;

export type NewExchangeRate = TablesInsert<"exchange_rates">;

// ─── Update Types  ────────────────────────────

export type AccountUpdate = TablesUpdate<"accounts">;

export type CategoryUpdate = TablesUpdate<"categories">;

export type TransactionUpdate = TablesUpdate<"transactions">;

export type DebtUpdate = TablesUpdate<"debts">;

export type ExchangeRateUpdate = TablesUpdate<"exchange_rates">;

// ─── Relation Types ─────────────────────────────

export type TransactionWithRelations = Transaction & {
  account: Pick<Account, "name" | "currency"> | null;
  category: Pick<Category, "name" | "color" | "icon"> | null;
};
