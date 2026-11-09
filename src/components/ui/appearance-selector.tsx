"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useId, useState } from "react";
import { twMerge } from "@/utils/tw-merge";
import { buttonVariants } from "./button";

const appearances = [
	{ value: "light", label: "Light", icon: Sun },
	{ value: "dark", label: "Dark", icon: Moon },
	{ value: "system", label: "System", icon: Monitor },
] as const;

export function AppearanceSelector() {
	const { theme, setTheme } = useTheme();
	const [mounted, setMounted] = useState(false);
	const id = useId();
	useEffect(() => setMounted(true), []);

	return (
		<fieldset className="field w-full max-w-md mt-5" disabled={!mounted} aria-describedby={`${id}-description`}>
			<legend className="mb-2 text-sm font-medium">Appearance</legend>
			<div className="flex gap-1 rounded-lg border border-border bg-muted p-1">
				{appearances.map(({ value, label, icon: Icon }) => (
					<label key={value} className="relative min-w-0 flex-1 cursor-pointer">
						<input
							type="radio"
							name={`${id}-appearance`}
							value={value}
							checked={mounted && theme === value}
							onChange={() => setTheme(value)}
							className="peer sr-only"
						/>
						<span
							className={twMerge(
								buttonVariants({ variant: "ghost", size: "sm" }),
								"min-h-11 sm:min-h-9 w-full gap-1.5 px-2 text-muted-foreground peer-checked:border-input peer-checked:bg-card peer-checked:text-foreground peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-background peer-disabled:opacity-50",
							)}
						>
							<Icon aria-hidden="true" />
							{label}
						</span>
					</label>
				))}
			</div>
			<p id={`${id}-description`} className="text-xs leading-relaxed text-muted-foreground">
				Choose a look, or follow your device with System. Your preference is saved on this browser.
			</p>
		</fieldset>
	);
}
