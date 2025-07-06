'use client'

import * as React from 'react'
import * as SwitchPrimitive from '@radix-ui/react-switch'

import { cn } from '@/utils/cn'

function Switch({
	className,
	...props
}: React.ComponentProps<typeof SwitchPrimitive.Root>): React.JSX.Element {
	return (
		<SwitchPrimitive.Root
			data-slot="switch"
			className={cn(
				'peer data-[state=checked]:bg-secondary data-[state=unchecked]:bg-base-300 focus-visible:border-ring focus-visible:ring-ring/50 inline-flex h-[1.5rem] w-12 shrink-0 items-center rounded-full border border-transparent cursor-pointer shadow-xs transition-all outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50',
				className
			)}
			{...props}
		>
			<SwitchPrimitive.Thumb
				data-slot="switch-thumb"
				className={cn(
					'bg-primary dark:data-[state=unchecked]:bg-foreground dark:data-[state=checked]:bg-primary-foreground pointer-events-none block size-6 rounded-full ring-0 transition-transform data-[state=checked]:translate-x-[calc(100%-1px)] data-[state=unchecked]:translate-x-0'
				)}
			/>
		</SwitchPrimitive.Root>
	)
}

export { Switch }
