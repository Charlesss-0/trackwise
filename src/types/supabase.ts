export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
	// Allows to automatically instantiate createClient with right options
	// instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
	__InternalSupabase: {
		PostgrestVersion: "14.5";
	};
	public: {
		Tables: {
			accounts: {
				Row: {
					available_balance: number | null;
					balance: number;
					created_at: string;
					credit_limit: number | null;
					currency: Database["public"]["Enums"]["currency_code"];
					id: string;
					name: string;
					type: Database["public"]["Enums"]["account_type"];
					updated_at: string;
					user_id: string;
				};
				Insert: {
					available_balance?: number | null;
					balance?: number;
					created_at?: string;
					credit_limit?: number | null;
					currency?: Database["public"]["Enums"]["currency_code"];
					id?: string;
					name: string;
					type: Database["public"]["Enums"]["account_type"];
					updated_at?: string;
					user_id?: string;
				};
				Update: {
					available_balance?: number | null;
					balance?: number;
					created_at?: string;
					credit_limit?: number | null;
					currency?: Database["public"]["Enums"]["currency_code"];
					id?: string;
					name?: string;
					type?: Database["public"]["Enums"]["account_type"];
					updated_at?: string;
					user_id?: string;
				};
				Relationships: [];
			};
			categories: {
				Row: {
					color: string;
					created_at: string;
					icon: string;
					id: string;
					is_default: boolean;
					name: string;
					user_id: string;
				};
				Insert: {
					color: string;
					created_at?: string;
					icon: string;
					id?: string;
					is_default?: boolean;
					name: string;
					user_id?: string;
				};
				Update: {
					color?: string;
					created_at?: string;
					icon?: string;
					id?: string;
					is_default?: boolean;
					name?: string;
					user_id?: string;
				};
				Relationships: [];
			};
			category_templates: {
				Row: {
					color: string;
					icon: string;
					id: string;
					name: string;
					sort_order: number;
				};
				Insert: {
					color: string;
					icon: string;
					id?: string;
					name: string;
					sort_order?: number;
				};
				Update: {
					color?: string;
					icon?: string;
					id?: string;
					name?: string;
					sort_order?: number;
				};
				Relationships: [];
			};
			debts: {
				Row: {
					created_at: string;
					creditor_name: string;
					currency: Database["public"]["Enums"]["currency_code"];
					due_day: number;
					id: string;
					monthly_payment: number;
					remaining_balance: number;
					total_amount: number;
					updated_at: string;
					user_id: string;
				};
				Insert: {
					created_at?: string;
					creditor_name: string;
					currency?: Database["public"]["Enums"]["currency_code"];
					due_day: number;
					id?: string;
					monthly_payment: number;
					remaining_balance: number;
					total_amount: number;
					updated_at?: string;
					user_id?: string;
				};
				Update: {
					created_at?: string;
					creditor_name?: string;
					currency?: Database["public"]["Enums"]["currency_code"];
					due_day?: number;
					id?: string;
					monthly_payment?: number;
					remaining_balance?: number;
					total_amount?: number;
					updated_at?: string;
					user_id?: string;
				};
				Relationships: [];
			};
			exchange_rates: {
				Row: {
					base_currency: string;
					fetched_at: string;
					id: string;
					is_manual: boolean;
					rate: number;
					target_currency: string;
				};
				Insert: {
					base_currency: string;
					fetched_at?: string;
					id?: string;
					is_manual?: boolean;
					rate: number;
					target_currency: string;
				};
				Update: {
					base_currency?: string;
					fetched_at?: string;
					id?: string;
					is_manual?: boolean;
					rate?: number;
					target_currency?: string;
				};
				Relationships: [];
			};
			transactions: {
				Row: {
					account_id: string;
					amount: number;
					category_id: string;
					created_at: string;
					currency: Database["public"]["Enums"]["currency_code"];
					date: string;
					id: string;
					is_recurring: boolean;
					note: string | null;
					recurring_due_day: number | null;
					recurring_frequency: Database["public"]["Enums"]["recurring_freq"] | null;
					type: Database["public"]["Enums"]["txn_type"];
					user_id: string;
				};
				Insert: {
					account_id: string;
					amount: number;
					category_id: string;
					created_at?: string;
					currency?: Database["public"]["Enums"]["currency_code"];
					date?: string;
					id?: string;
					is_recurring?: boolean;
					note?: string | null;
					recurring_due_day?: number | null;
					recurring_frequency?: Database["public"]["Enums"]["recurring_freq"] | null;
					type: Database["public"]["Enums"]["txn_type"];
					user_id?: string;
				};
				Update: {
					account_id?: string;
					amount?: number;
					category_id?: string;
					created_at?: string;
					currency?: Database["public"]["Enums"]["currency_code"];
					date?: string;
					id?: string;
					is_recurring?: boolean;
					note?: string | null;
					recurring_due_day?: number | null;
					recurring_frequency?: Database["public"]["Enums"]["recurring_freq"] | null;
					type?: Database["public"]["Enums"]["txn_type"];
					user_id?: string;
				};
				Relationships: [
					{
						foreignKeyName: "transactions_account_id_fkey";
						columns: ["account_id"];
						isOneToOne: false;
						referencedRelation: "accounts";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "transactions_category_id_fkey";
						columns: ["category_id"];
						isOneToOne: false;
						referencedRelation: "categories";
						referencedColumns: ["id"];
					},
				];
			};
		};
		Views: {
			[_ in never]: never;
		};
		Functions: {
			copy_default_categories_for_user: {
				Args: { target_user_id: string };
				Returns: undefined;
			};
			update_account_balance: {
				Args: { p_account_id: string; p_amount: number };
				Returns: undefined;
			};
		};
		Enums: {
			account_type: "debit" | "credit" | "cash" | "savings";
			currency_code: "NIO" | "USD";
			recurring_freq: "monthly" | "weekly" | "biweekly" | "yearly";
			txn_type: "income" | "expense";
		};
		CompositeTypes: {
			[_ in never]: never;
		};
	};
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">];

export type Tables<
	DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"]) | { schema: keyof DatabaseWithoutInternals },
	TableName extends DefaultSchemaTableNameOrOptions extends {
		schema: keyof DatabaseWithoutInternals;
	}
		? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
				DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
		: never = never,
> = DefaultSchemaTableNameOrOptions extends {
	schema: keyof DatabaseWithoutInternals;
}
	? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
			DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
			Row: infer R;
		}
		? R
		: never
	: DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
		? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
				Row: infer R;
			}
			? R
			: never
		: never;

export type TablesInsert<
	DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
	TableName extends DefaultSchemaTableNameOrOptions extends {
		schema: keyof DatabaseWithoutInternals;
	}
		? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
		: never = never,
> = DefaultSchemaTableNameOrOptions extends {
	schema: keyof DatabaseWithoutInternals;
}
	? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
			Insert: infer I;
		}
		? I
		: never
	: DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
		? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
				Insert: infer I;
			}
			? I
			: never
		: never;

export type TablesUpdate<
	DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
	TableName extends DefaultSchemaTableNameOrOptions extends {
		schema: keyof DatabaseWithoutInternals;
	}
		? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
		: never = never,
> = DefaultSchemaTableNameOrOptions extends {
	schema: keyof DatabaseWithoutInternals;
}
	? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
			Update: infer U;
		}
		? U
		: never
	: DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
		? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
				Update: infer U;
			}
			? U
			: never
		: never;

export type Enums<
	DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"] | { schema: keyof DatabaseWithoutInternals },
	EnumName extends DefaultSchemaEnumNameOrOptions extends {
		schema: keyof DatabaseWithoutInternals;
	}
		? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
		: never = never,
> = DefaultSchemaEnumNameOrOptions extends {
	schema: keyof DatabaseWithoutInternals;
}
	? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
	: DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
		? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
		: never;

export type CompositeTypes<
	PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"] | { schema: keyof DatabaseWithoutInternals },
	CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
		schema: keyof DatabaseWithoutInternals;
	}
		? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
		: never = never,
> = PublicCompositeTypeNameOrOptions extends {
	schema: keyof DatabaseWithoutInternals;
}
	? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
	: PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
		? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
		: never;

export const Constants = {
	public: {
		Enums: {
			account_type: ["debit", "credit", "cash", "savings"],
			currency_code: ["NIO", "USD"],
			recurring_freq: ["monthly", "weekly", "biweekly", "yearly"],
			txn_type: ["income", "expense"],
		},
	},
} as const;
