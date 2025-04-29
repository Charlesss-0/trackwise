'use client'

import * as ProgressPrimitive from '@radix-ui/react-progress'
import * as React from 'react'

import { cn } from '@/utils/cn'

function Progress({
	className,
	value,
	...props
}: React.ComponentProps<typeof ProgressPrimitive.Root>): React.ReactNode {
	return (
		<ProgressPrimitive.Root
			data-slot="progress"
			className={cn(
				'bg-green-primary/20 dark:bg-light-green/20 relative h-1 w-full overflow-hidden rounded-full',
				className
			)}
			{...props}
		>
			<ProgressPrimitive.Indicator
				data-slot="progress-indicator"
				className="flex-1 w-full h-full transition-all bg-green-primary dark:bg-light-green"
				style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
			/>
		</ProgressPrimitive.Root>
	)
}

export { Progress }
