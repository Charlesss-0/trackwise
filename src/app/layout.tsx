import type { Metadata, Viewport } from "next";
import { DM_Sans, Geist_Mono, Manrope } from "next/font/google";
import { ThemeProvider } from "@/components/providers/theme-provider";
import "./globals.css";

const bodyFont = DM_Sans({
	variable: "--font-body",
	subsets: ["latin"],
});

const headingFont = Manrope({ variable: "--font-heading", subsets: ["latin"] });

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "Trackwise",
	description: "Take control of your financial future",
	formatDetection: {
		telephone: false,
	},
	icons: {
		icon: [
			{ url: "/favicon.ico", sizes: "48x48" },
			{ url: "/icons/icon-192x192.png", type: "image/png", sizes: "192x192" },
			{ url: "/icons/icon-512x512.png", type: "image/png", sizes: "512x512" },
		],
		apple: [{ url: "/icons/icon-180x180.png", sizes: "180x180" }],
	},
	appleWebApp: {
		capable: true,
		statusBarStyle: "black-translucent",
		title: "Trackwise",
		startupImage: [
			{
				url: "/splash/splash-1290x2796.png",
				media: "screen and (device-width: 430px) and (device-height: 932px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)",
			},
			{
				url: "/splash/splash-2796x1290.png",
				media: "screen and (device-width: 430px) and (device-height: 932px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)",
			},
			{
				url: "/splash/splash-1179x2556.png",
				media: "screen and (device-width: 393px) and (device-height: 852px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)",
			},
			{
				url: "/splash/splash-2556x1179.png",
				media: "screen and (device-width: 393px) and (device-height: 852px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)",
			},
			{
				url: "/splash/splash-750x1334.png",
				media: "screen and (device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)",
			},
			{
				url: "/splash/splash-1334x750.png",
				media: "screen and (device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)",
			},
			{
				url: "/splash/splash-2048x2732.png",
				media: "screen and (device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)",
			},
			{
				url: "/splash/splash-2732x2048.png",
				media: "screen and (device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)",
			},
			{
				url: "/splash/splash-1668x2388.png",
				media: "screen and (device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)",
			},
			{
				url: "/splash/splash-2388x1668.png",
				media: "screen and (device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)",
			},
			{
				url: "/splash/splash-1640x2360.png",
				media: "screen and (device-width: 820px) and (device-height: 1180px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)",
			},
			{
				url: "/splash/splash-2360x1640.png",
				media: "screen and (device-width: 820px) and (device-height: 1180px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)",
			},
			{
				url: "/splash/splash-1536x2048.png",
				media: "screen and (device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)",
			},
			{
				url: "/splash/splash-2048x1536.png",
				media: "screen and (device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)",
			},
		],
	},
};

export const viewport: Viewport = {
	themeColor: [
		{ media: "(prefers-color-scheme: light)", color: "#f6f7f4" },
		{ media: "(prefers-color-scheme: dark)", color: "#151c19" },
	],
	width: "device-width",
	initialScale: 1,
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning className={`${bodyFont.variable} ${headingFont.variable} ${geistMono.variable} h-full antialiased`}>
			<body className="min-h-full flex flex-col">
				<ThemeProvider>{children}</ThemeProvider>
			</body>
		</html>
	);
}
