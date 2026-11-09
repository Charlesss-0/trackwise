"use client";

import { ArrowRight, TriangleAlert } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { type SubmitEvent, Suspense, useState } from "react";
import { AuthLayout } from "@/components/layout/auth-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
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
		<AuthLayout
			title="Welcome back"
			description="Pick up where you left off. Your financial picture is waiting."
			footer={
				<>
					Don&apos;t have an account?{" "}
					<Link href="/auth/signup" className="ml-1 font-semibold text-primary hover:underline">
						Create one
					</Link>
				</>
			}
		>
			{(error || urlError) && (
				<div
					role="alert"
					className="mb-5 flex items-start gap-2 rounded-lg border border-destructive/20 bg-destructive/5 p-3 text-sm text-destructive"
				>
					<TriangleAlert className="mt-0.5 size-4 shrink-0" />
					<span>{error || urlError}</span>
				</div>
			)}

			<form onSubmit={handleEmailLogin} className="space-y-5">
				<div className="field">
					<Label htmlFor="email">Email address</Label>

					<Input
						id="email"
						type="email"
						placeholder="you@example.com"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						autoComplete="email"
					/>
				</div>

				<div className="field">
					<Label htmlFor="password">Password</Label>
					<Input
						id="password"
						type="password"
						placeholder="Enter your password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						autoComplete="current-password"
					/>
				</div>

				<Button type="submit" disabled={loading} className="mt-2 w-full" size="lg">
					{loading ? (
						<>
							<LoadingSpinner size="sm" /> Signing in…
						</>
					) : (
						<>
							Sign in
							<ArrowRight />
						</>
					)}
				</Button>
			</form>
		</AuthLayout>
	);
}

export default function LoginPage() {
	return (
		<Suspense
			fallback={
				<div className="flex min-h-dvh items-center justify-center">
					<LoadingSpinner />
				</div>
			}
		>
			<LoginContent />
		</Suspense>
	);
}
