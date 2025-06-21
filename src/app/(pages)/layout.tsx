import Sidebar from '@/components/sidebar'
import React, { type JSX } from 'react'

export default function PagesLayout({ children }: { children: JSX.Element }): JSX.Element {
	return (
		<div className="flex h-full">
			<Sidebar />
			<main className="w-full">{children}</main>
		</div>
	)
}
