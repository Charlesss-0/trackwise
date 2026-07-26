"use client";

import { TrendingUp, TriangleAlert } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { type SubmitEvent, Suspense, useState } from "react";
import { createClient } from "@/lib/supabase/client";

function LoginContent() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);
	const router = useRouter();
	const searchParams = useSearchParams();
	const urlError = searchParams.get("error");

	const supabase = createClient();

	async function handleEmailLogin(e: SubmitEvent) {
		e.preventDefault();
		setError("");

		if (!email.trim()) {
			setError("Email is required");
			return;
		}
		if (!password) {
			setError("Password is required");
			return;
		}

		setLoading(true);
		const { error: signInError } = await supabase.auth.signInWithPassword({
			email: email.trim(),
			password,
		});

		if (signInError) {
			console.error("[Login] Email/password sign-in failed:", signInError.message, { email: email.trim() });
			setError(signInError.message);
			setLoading(false);
			return;
		}

		router.push("/dashboard");
	}

	return (
		<div className="auth-gradient min-h-dvh flex items-center justify-center p-4">
			<div className="fixed inset-0 overflow-hidden pointer-events-none">
				<div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-primary/5 blur-3xl" />
				<div className="absolute bottom-1/3 right-1/4 w-96 h-96 rounded-full bg-secondary/5 blur-3xl" />
			</div>

			<div className="w-full max-w-md relative z-10 animate-fade-in">
				<div className="text-center mb-8">
					<div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 mb-4 pulse-glow">
						<TrendingUp className="w-7 h-7 text-primary" />
					</div>
					<h1 className="text-3xl font-bold tracking-tight">Trackwise</h1>
					<p className="text-base-content/50 mt-1 text-sm">Take control of your financial future</p>
				</div>

				<div className="glass-card rounded-2xl p-8 shadow-2xl">
					<h2 className="text-xl font-semibold mb-6">Welcome back</h2>

					{(error || urlError) && (
						<div className="alert alert-error mb-4 text-sm animate-fade-in">
							<TriangleAlert />
							<span>{error || urlError}</span>
						</div>
					)}

					<form onSubmit={handleEmailLogin} className="space-y-4">
						<fieldset className="fieldset">
							<label htmlFor="email" className="fieldset-label text-xs font-medium text-base-content/70 mb-1">
								Email
							</label>
							<input
								id="email"
								type="email"
								placeholder="you@example.com"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								className="input input-bordered w-full bg-base-200/50 focus:bg-base-200"
								autoComplete="email"
							/>
						</fieldset>

						<fieldset className="fieldset">
							<label htmlFor="password" className="fieldset-label text-xs font-medium text-base-content/70 mb-1">
								Password
							</label>
							<input
								id="password"
								type="password"
								placeholder="••••••••"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								className="input input-bordered w-full bg-base-200/50 focus:bg-base-200"
								autoComplete="current-password"
							/>
						</fieldset>

						<button type="submit" disabled={loading} className="btn btn-primary btn-block mt-2">
							{loading ? <span className="loading loading-spinner loading-sm" /> : "Sign in"}
						</button>
					</form>
				</div>

				<p className="text-center text-sm text-base-content/50 mt-6 animate-fade-in-delay-2">
					Don&apos;t have an account?{" "}
					<Link href="/signup" className="text-primary hover:text-primary/80 font-medium">
						Create one
					</Link>
				</p>
			</div>
		</div>
	);
}

export default function LoginPage() {
	return (
		<Suspense fallback={<div className="min-h-dvh flex items-center justify-center">Loading...</div>}>
			<LoginContent />
		</Suspense>
	);
}
