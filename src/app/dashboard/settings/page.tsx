"use client";

import { useEffect, useState } from "react";
import { useExchangeRate, useSetManualRate } from "@/hooks/use-exchange-rate";
import { useUIStore } from "@/stores/ui-store";

export default function SettingsPage() {
	const { homeCurrency, setHomeCurrency } = useUIStore();
	const { data: rate, isLoading } = useExchangeRate();
	const { mutate: setManual, isPending } = useSetManualRate();
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
		<div className="space-y-6 max-w-2xl">
			<h1 className="text-2xl font-bold">Settings</h1>

			<div className="card bg-base-200 border border-base-300">
				<div className="card-body">
					<h2 className="card-title">Preferences</h2>

					<div className="form-control w-full max-w-xs mt-4">
						<label className="label">
							<span className="label-text font-medium">Home Currency</span>
						</label>

						<select className="select select-bordered" value={homeCurrency} onChange={(e) => setHomeCurrency(e.target.value as "NIO" | "USD")}>
							<option value="USD">USD - US Dollar ($)</option>
							<option value="NIO">NIO - Nicaraguan Córdoba (C$)</option>
						</select>

						<label className="label">
							<span className="label-text-alt text-base-content/60">All totals and summaries will be converted to this currency.</span>
						</label>
					</div>
				</div>
			</div>

			<div className="card bg-base-200 border border-base-300">
				<div className="card-body">
					<h2 className="card-title">Exchange Rate (NIO per USD)</h2>

					<div className="form-control w-full max-w-xs mt-4">
						<label className="label">
							<span className="label-text font-medium">Current Rate</span>
						</label>

						<div className="flex gap-2">
							<input
								type="number"
								step="0.01"
								className="input input-bordered w-full"
								value={manualValue}
								onChange={(e) => setManualValue(e.target.value)}
							/>
							<button className="btn btn-primary" onClick={handleSaveRate} disabled={isPending || parseFloat(manualValue) === rate}>
								Save
							</button>
						</div>

						<label className="label">
							<span className="label-text-alt text-base-content/60">
								{isLoading ? "Loading rate..." : `Currently using ${isManual ? "manual" : "automatic"} rate.`}
							</span>
						</label>
					</div>
				</div>
			</div>
		</div>
	);
}
