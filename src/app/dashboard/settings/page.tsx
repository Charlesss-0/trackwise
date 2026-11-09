/** biome-ignore-all lint/suspicious/noExplicitAny: any */
"use client";

import { useEffect, useState } from "react";
import { AppearanceSelector } from "@/components/ui/appearance-selector";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ErrorNotice } from "@/components/ui/feedback";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NativeSelect } from "@/components/ui/native-select";
import { PageHeader } from "@/components/ui/page-header";
import { useExchangeRate, useSetManualRate } from "@/hooks/use-exchange-rate";
import { useUIStore } from "@/stores/ui-store";

export default function SettingsPage() {
	const { homeCurrency, setHomeCurrency } = useUIStore();
	const { data: rate, isLoading } = useExchangeRate();
	const { mutate: setManual, isPending, isSuccess, error: saveError } = useSetManualRate();
	const isManual = useUIStore((s) => (s as any).isManual) || false;

	const [manualValue, setManualValue] = useState<string>("");

	useEffect(() => {
		if (rate) setManualValue(rate.toString());
	}, [rate]);

	const handleSaveRate = () => {
		const num = parseFloat(manualValue);
		if (!Number.isNaN(num) && num > 0) {
			setManual(num);
		}
	};

	return (
		<div className="space-y-6 max-w-3xl">
			<PageHeader title="Settings" description="Make Trackwise feel right for the way you manage your money." />

			<Card>
				<div className="p-5 sm:p-6">
					<h2 className="flex items-center gap-2 font-display font-semibold">Preferences</h2>
					<AppearanceSelector />

					<div className="field w-full max-w-md mt-5">
						<Label htmlFor="home-currency">
							<span className="text-sm font-medium">Home Currency</span>
						</Label>

						<NativeSelect id="home-currency" value={homeCurrency} onChange={(e) => setHomeCurrency(e.target.value as "NIO" | "USD")}>
							<option value="USD">USD - US Dollar ($)</option>
							<option value="NIO">NIO - Nicaraguan Córdoba (C$)</option>
						</NativeSelect>

						<p>
							<span className="text-xs text-muted-foreground">All totals and summaries will be converted to this currency.</span>
						</p>
					</div>
				</div>
			</Card>

			<Card>
				<div className="p-5 sm:p-6">
					<h2 className="flex items-center gap-2 font-display font-semibold">Exchange Rate (NIO per USD)</h2>

					<div className="field w-full max-w-md mt-5">
						<Label htmlFor="exchange-rate">
							<span className="text-sm font-medium">Current Rate</span>
						</Label>

						<div className="flex gap-2">
							<Input
								id="exchange-rate"
								type="number"
								step="0.01"
								className="w-full"
								value={manualValue}
								onChange={(e) => setManualValue(e.target.value)}
							/>

							<Button
								variant="default"
								size="default"
								type="button"
								onClick={handleSaveRate}
								disabled={isPending || parseFloat(manualValue) === rate}
							>
								{isPending ? "Saving…" : isSuccess && parseFloat(manualValue) === rate ? "Saved" : "Save"}
							</Button>
						</div>

						<ErrorNotice error={saveError} />

						<p>
							<span className="text-xs text-muted-foreground">
								{isLoading ? "Loading rate..." : `Currently using ${isManual ? "manual" : "automatic"} rate.`}
							</span>
						</p>
					</div>
				</div>
			</Card>
		</div>
	);
}
