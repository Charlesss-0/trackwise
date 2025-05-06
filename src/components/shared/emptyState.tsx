'use client'

import { Button } from '../ui/button'
import { cn } from '@/utils/cn'

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
}): React.ReactNode {
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
