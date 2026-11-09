import { ArrowLeftRight, CreditCard, Wallet } from "lucide-react";
import type { ReactNode } from "react";
import { Brand } from "./brand";

export function AuthLayout({ title, description, children, footer }: { title: string; description: string; children: ReactNode; footer: ReactNode }) {
	return (
		<main className="grid min-h-dvh lg:grid-cols-2">
			<section className="relative hidden flex-col justify-between overflow-hidden border-r border-border bg-secondary p-12 lg:flex xl:p-16">
				<Brand />

				<div className="relative z-10 my-16 max-w-lg">
					<span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-secondary-foreground/70">A little clarity, every day</span>

					<h2 className="mt-6 font-display text-[clamp(2.5rem,4vw,4.5rem)] font-medium leading-[1.1] tracking-[-0.055em] text-secondary-foreground">
						Your money.
						<br />A clearer
						<br />
						<span className="font-semibold">perspective.</span>
					</h2>

					<p className="mt-6 max-w-sm text-base leading-relaxed text-secondary-foreground/75">
						Find your financial rhythm. Bring your accounts, everyday spending, and payments into focus.
					</p>

					<div className="mt-10 flex flex-wrap gap-3">
						{[
							{ icon: Wallet, text: "Every account" },
							{ icon: ArrowLeftRight, text: "Every transaction" },
							{ icon: CreditCard, text: "Every payment" },
						].map(({ icon: Icon, text }) => (
							<span key={text} className="flex items-center gap-2 rounded-full border border-primary/15 px-3 py-2 text-xs text-secondary-foreground">
								<Icon size={14} />
								{text}
							</span>
						))}
					</div>
				</div>

				<p className="text-xs text-secondary-foreground/70">Less guesswork. More peace of mind.</p>

				<div aria-hidden="true" className="pointer-events-none absolute -bottom-48 -right-40 size-125 rounded-full border-55 border-primary/5" />
			</section>

			<section className="flex flex-col items-center justify-center px-6 py-12 sm:px-12">
				<div className="mb-12 lg:hidden">
					<Brand />
				</div>

				<div className="w-full max-w-sm">
					<p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Your personal finance workspace</p>

					<h1 className="font-display text-3xl font-semibold tracking-tight">{title}</h1>

					<p className="mb-8 mt-3 text-sm leading-relaxed text-muted-foreground">{description}</p>
					{children}
					<div className="mt-7 border-t border-border pt-6 text-sm text-muted-foreground">{footer}</div>
				</div>

				<p className="mt-16 text-xs text-muted-foreground">Trackwise · A little more clarity.</p>
			</section>
		</main>
	);
}
