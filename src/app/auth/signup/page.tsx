"use client";

import { MailCheck, TrendingUp, TriangleAlert } from "lucide-react";
import Link from "next/link";
import { type SubmitEvent, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function SignupPage() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [error, setError] = useState("");
	const [success, setSuccess] = useState(false);
	const [loading, setLoading] = useState(false);

	const supabase = createClient();

	async function handleEmailSignup(e: SubmitEvent) {
		e.preventDefault();
		setError("");

		if (!email.trim()) {
			setError("Email is required");
			return;
		}
		if (password.length < 8) {
			setError("Password must be at least 8 characters");
			return;
		}
		if (password !== confirmPassword) {
			setError("Passwords do not match");
			return;
		}

		setLoading(true);
		const { error: signUpError } = await supabase.auth.signUp({
			email: email.trim(),
			password,
			options: {
				emailRedirectTo: `${window.location.origin}/auth/callback`,
			},
		});

		if (signUpError) {
			setError(signUpError.message);
			setLoading(false);
			return;
		}

		setSuccess(true);
		setLoading(false);
	}

	if (success) {
		return (
			<div className="auth-gradient min-h-dvh flex items-center justify-center p-4">
				<div className="w-full max-w-md animate-fade-in">
					<div className="glass-card rounded-2xl p-8 shadow-2xl text-center">
						<div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-success/10 mb-4">
							<MailCheck />
						</div>
						<h2 className="text-xl font-semibold mb-2">Check your email</h2>
						<p className="text-base-content/60 text-sm mb-6">
							We&apos;ve sent a confirmation link to <span className="font-medium text-base-content">{email}</span>. Click it to activate your
							account.
						</p>
						<Link href="/login" className="btn btn-primary btn-block">
							Back to sign in
						</Link>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="auth-gradient min-h-dvh flex items-center justify-center p-4">
			<div className="fixed inset-0 overflow-hidden pointer-events-none">
				<div className="absolute top-1/3 right-1/4 w-72 h-72 rounded-full bg-primary/5 blur-3xl" />
				<div className="absolute bottom-1/4 left-1/3 w-80 h-80 rounded-full bg-accent/5 blur-3xl" />
			</div>

			<div className="w-full max-w-md relative z-10 animate-fade-in">
				<div className="text-center mb-8">
					<div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 mb-4 pulse-glow">
						<TrendingUp className="w-7 h-7 text-primary" />
					</div>
					<h1 className="text-3xl font-bold tracking-tight">Trackwise</h1>
					<p className="text-base-content/50 mt-1 text-sm">Start your journey to financial clarity</p>
				</div>

				<div className="glass-card rounded-2xl p-8 shadow-2xl">
					<h2 className="text-xl font-semibold mb-6">Create your account</h2>

					{error && (
						<div className="alert alert-error mb-4 text-sm animate-fade-in">
							<TriangleAlert />
							<span>{error}</span>
						</div>
					)}

					<form onSubmit={handleEmailSignup} className="space-y-4">
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
								placeholder="At least 8 characters"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								className="input input-bordered w-full bg-base-200/50 focus:bg-base-200"
								autoComplete="new-password"
							/>
						</fieldset>

						<fieldset className="fieldset">
							<label htmlFor="confirm-password" className="fieldset-label text-xs font-medium text-base-content/70 mb-1">
								Confirm password
							</label>
							<input
								id="confirm-password"
								type="password"
								placeholder="••••••••"
								value={confirmPassword}
								onChange={(e) => setConfirmPassword(e.target.value)}
								className="input input-bordered w-full bg-base-200/50 focus:bg-base-200"
								autoComplete="new-password"
							/>
						</fieldset>

						<button type="submit" disabled={loading} className="btn btn-primary btn-block mt-2">
							{loading ? <span className="loading loading-spinner loading-sm" /> : "Create account"}
						</button>
					</form>
				</div>

				<p className="text-center text-sm text-base-content/50 mt-6 animate-fade-in-delay-2">
					Already have an account?{" "}
					<Link href="/auth/login" className="text-primary hover:text-primary/80 font-medium">
						Sign in
					</Link>
				</p>
			</div>
		</div>
	);
}
