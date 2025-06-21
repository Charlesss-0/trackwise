import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/utils/cn'

const buttonVariants = cva(
	'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-semibold transition-all cursor-pointer disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none outline-none focus-visible:border-ring focus-visible:ring-secondary/80 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 aria-invalid:border-destructive',
	{
		variants: {
			variant: {
				default: 'bg-primary text-primary-content hover:bg-primary/90',
				secondary: 'bg-secondary text-secondary-content hover:bg-secondary/90',
				destructive: 'bg-destructive text-destructive-content hover:bg-destructive/90',
				outline: 'border border-base-300 shadow-sm text-base-content hover:bg-base-300/80',
				ghost: 'hover:bg-base-200 dark:hover:bg-base-300',
				link: 'text-primary underline-offset-4 hover:underline',
			},
			size: {
				default: 'h-9 px-4 py-2 has-[>svg]:px-3',
				sm: 'h-8 gap-1.5 px-3 has-[>svg]:px-2.5',
				lg: 'h-10 px-6 has-[>svg]:px-4',
				icon: 'size-10',
			},
		},
		defaultVariants: {
			variant: 'default',
			size: 'default',
		},
	}
)

function Button({
	className,
	variant,
	size,
	asChild = false,
	...props
}: React.ComponentProps<'button'> &
	VariantProps<typeof buttonVariants> & {
		asChild?: boolean
	}): React.JSX.Element {
	const Comp = asChild ? Slot : 'button'

	return (
		<Comp
			data-slot="button"
			className={cn(buttonVariants({ variant, size, className }))}
			{...props}
		/>
	)
}

export { Button, buttonVariants }
