import Header from '@/components/dashboard/header'
import QuickStats from '@/components/dashboard/quick-stats'
import { type JSX } from 'react'

export default function Dashboard(): JSX.Element {
	return (
		<div className="w-full h-full md:mx-auto md:max-w-[1600px] p-5 space-y-4">
			<Header />

			<QuickStats />
		</div>
	)
}
