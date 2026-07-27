"use client";

import { useEffect } from "react";

/**
 * Registers the Serwist service worker so the app becomes a real, installable,
 * offline-capable PWA. The generated `public/sw.js` only exists in production
 * builds, so we guard on `NODE_ENV` to avoid dev noise/errors.
 */
export function ServiceWorkerRegister() {
	useEffect(() => {
		if (process.env.NODE_ENV !== "production" || typeof window === "undefined" || !("serviceWorker" in navigator)) {
			return;
		}

		const onLoad = () => {
			navigator.serviceWorker.register("/serwist/sw.js").catch((error) => {
				console.error("Service worker registration failed:", error);
			});
		};

		window.addEventListener("load", onLoad);
		return () => window.removeEventListener("load", onLoad);
	}, []);

	return null;
}
