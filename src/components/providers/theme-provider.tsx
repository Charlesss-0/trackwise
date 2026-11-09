"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ReactNode, useEffect } from "react";

export const THEME_STORAGE_KEY = "trackwise-appearance";

export function ThemeProvider({ children }: { children: ReactNode }) {
	useEffect(() => {
		// Keep browser chrome aligned with an explicit preference, even if it differs from the OS.
		const syncThemeColor = () => {
			const background = getComputedStyle(document.documentElement).getPropertyValue("--background").trim();
			if (!background) return;
			for (const meta of document.querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]')) {
				meta.content = background;
			}
		};
		syncThemeColor();
		const observer = new MutationObserver(syncThemeColor);
		observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
		return () => observer.disconnect();
	}, []);

	return (
		<NextThemesProvider
			attribute="class"
			storageKey={THEME_STORAGE_KEY}
			defaultTheme="system"
			enableSystem
			enableColorScheme
			disableTransitionOnChange
		>
			{children}
		</NextThemesProvider>
	);
}
