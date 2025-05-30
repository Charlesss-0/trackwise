'use client'

import { Button } from '@/components/ui/button'
import { cn } from '@/utils/cn'
import { type JSX } from 'react'

export default function EmptyState({
	message,
	btnText,
	onClick,
	className,
}: {
	message: string
	btnText: string
	onClick?: () => void
	className?: string
}): JSX.Element {
	return (
		<div className={cn('flex flex-col items-center justify-center h-full', className)}>
			<p className="text-xs font-medium md:text-sm text-neutral">{message}</p>
			{btnText && (
				<Button variant="outline" className="mt-4 text-xs md:text-sm" onClick={onClick}>
					{btnText}
				</Button>
			)}
		</div>
	)
}
