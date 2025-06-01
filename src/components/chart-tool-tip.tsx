import { type TooltipProps } from 'recharts'
import { Card } from '@/components/ui/card'
import { cn } from '@/utils/cn'
import { type JSX } from 'react'

export default function ChartTooltip({
	payload,
	active,
}: TooltipProps<any, any>): JSX.Element | undefined {
	if (active && payload && payload.length) {
		return (
			<Card className="flex flex-col gap-1 bg-base-100">
				<span className="text-xs font-semibold text-base-content md:text-sm">
					{payload[0].payload.month}
				</span>
				{payload.map(({ name, value }, index) => (
					<div key={index} className="flex items-center gap-2">
						<span className="text-xs font-semibold text-neutral md:text-sm">
							{name.charAt(0).toUpperCase() + name.slice(1)}
						</span>
						<span
							className={cn(
								'text-xs font-semibold md:text-sm',
								name === 'income'
									? 'text-green-primary'
									: name === 'expenses'
									? 'text-destructive'
									: 'text-info'
							)}
						>
							${value.toFixed(2)}
						</span>
					</div>
				))}
			</Card>
		)
	}
}
