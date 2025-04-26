import * as React from 'react'

import { cn } from '@/utils/cn'

function Card({ className, ...props }: React.ComponentProps<'div'>): React.ReactNode {
	return (
		<div
			data-slot="card"
			className={cn(
				'bg-base-200 text-base-content flex flex-col gap-4 rounded-xl border border-base-300 p-4 dark:bg-base-200-dark dark:text-base-content-dark dark:border-base-300-dark',
				className
			)}
			{...props}
		/>
	)
}

function CardHeader({ className, ...props }: React.ComponentProps<'div'>): React.ReactNode {
	return (
		<div
			data-slot="card-header"
			className={cn('flex items-center text-sm justify-between font-medium', className)}
			{...props}
		/>
	)
}

function CardTitle({ className, ...props }: React.ComponentProps<'div'>): React.ReactNode {
	return (
		<div
			data-slot="card-title"
			className={cn('leading-none font-semibold', className)}
			{...props}
		/>
	)
}

function CardDescription({ className, ...props }: React.ComponentProps<'div'>): React.ReactNode {
	return (
		<div
			data-slot="card-description"
			className={cn('text-muted-foreground text-sm', className)}
			{...props}
		/>
	)
}

function CardAction({ className, ...props }: React.ComponentProps<'div'>): React.ReactNode {
	return (
		<div
			data-slot="card-action"
			className={cn('col-start-2 row-span-2 row-start-1 self-start justify-self-end', className)}
			{...props}
		/>
	)
}

function CardContent({ className, ...props }: React.ComponentProps<'div'>): React.ReactNode {
	return <div data-slot="card-content" className={cn('flex text-sm', className)} {...props} />
}

function CardFooter({ className, ...props }: React.ComponentProps<'div'>): React.ReactNode {
	return <div data-slot="card-footer" className={cn('flex items-center', className)} {...props} />
}

export { Card, CardHeader, CardFooter, CardTitle, CardAction, CardDescription, CardContent }
