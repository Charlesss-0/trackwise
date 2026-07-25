import type { Enums } from "@/types/supabase";

export type Currency = Enums<"currency_code">;

export type AccountType = Enums<"account_type">;

export type TxnType = Enums<"txn_type">;

export type RecurringFreq = Enums<"recurring_freq">;
