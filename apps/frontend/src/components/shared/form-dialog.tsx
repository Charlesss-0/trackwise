import { Fragment, type JSX } from 'react'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'

export default function FormDialog({
	data,
	open,
	onOpenChange,
}: {
	data: any
	open: boolean
	onOpenChange: (open: boolean) => void
}): JSX.Element {
	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[425px]">
				{data.map((item: any, index: number) => (
					<Fragment key={index}>
						<DialogHeader>
							<DialogTitle>{item.title}</DialogTitle>

							<DialogDescription>{item.description}</DialogDescription>
						</DialogHeader>

						{item.form && (
							<form>
								{item.form.map((field: any, index: number) => (
									<div key={index}>
										<fieldset>
											<label htmlFor={field.name}>{field.label}</label>

											<input
												type={field.type}
												name={field.name}
												id={field.name}
												placeholder={field.placeholder}
												value={field.value || ''}
											/>
										</fieldset>
									</div>
								))}
							</form>
						)}
					</Fragment>
				))}
			</DialogContent>
		</Dialog>
	)
}
