import './globals.css'

import { geistMono, geistSans } from '@/fonts'

import type { Metadata } from 'next'
import { ThemeProvider } from '@/components/hoc/themeProvider'

export const metadata: Metadata = {
	title: 'Trackwise',
	description: 'Budget tracking made easy',
}

export default function RootLayout({
	children,
}: Readonly<{ children: React.ReactNode }>): React.ReactNode {
	return (
		<html lang="en" suppressHydrationWarning data-theme>
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased bg-base-100 dark:bg-base-100-dark`}
			>
				<ThemeProvider attribute="data-theme" defaultTheme="dark" disableTransitionOnChange>
					{children}
				</ThemeProvider>
			</body>
		</html>
	)
}
