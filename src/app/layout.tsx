import './globals.css'

import { amulya } from '@/fonts'

import type { Metadata } from 'next'
import { ThemeProvider } from '@/components/shared/theme-provider'
import { type JSX } from 'react'

export const metadata: Metadata = {
	title: 'Trackwise',
	description: 'Budget tracking made easy',
}

export default function RootLayout({
	children,
}: Readonly<{ children: React.ReactNode }>): JSX.Element {
	return (
		<html lang="en" suppressHydrationWarning>
			<body className={`${amulya.variable} antialiased bg-base-100`}>
				<ThemeProvider attribute="class" defaultTheme="dark" disableTransitionOnChange>
					{children}
				</ThemeProvider>
			</body>
		</html>
	)
}
