import './globals.css'

import { geistMono, geistSans } from '@/fonts'

import type { Metadata } from 'next'

export const metadata: Metadata = {
	title: 'Trackwise',
	description: 'Budget tracking made easy',
}

export default function RootLayout({
	children,
}: Readonly<{ children: React.ReactNode }>): React.ReactNode {
	return (
		<html lang="en" data-theme="dark">
			<body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>{children}</body>
		</html>
	)
}
