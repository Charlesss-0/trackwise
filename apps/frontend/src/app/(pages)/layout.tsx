import Sidebar from '@/components/shared/sidebar'
import React, { type JSX } from 'react'

export default function PagesLayout({ children }: { children: JSX.Element }): JSX.Element {
	return (
		<div className="flex h-full">
			<Sidebar />

			<main className="w-full h-full md:mx-auto md:max-w-[1600px] p-10 space-y-4">{children}</main>
		</div>
	)
}
