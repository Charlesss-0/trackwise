"use client";

import { ArrowRight, TriangleAlert } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { type SubmitEvent, useState } from "react";
import { AuthLayout } from "@/components/layout/auth-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { createClient } from "@/lib/supabase/client";

export default function SignupPage() {
	const router = useRouter();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [error, setError] = useState("");
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
		});

		if (signUpError) {
			setError(signUpError.message);
			setLoading(false);
			return;
		}

		router.push("/");
	}

	return (
		<AuthLayout
			title="Create your account"
			description="A clearer view of your finances starts here."
			footer={
				<>
					Already have an account?{" "}
					<Link href="/auth/login" className="ml-1 font-semibold text-primary hover:underline">
						Sign in
					</Link>
				</>
			}
		>
			{error && (
				<div
					role="alert"
					className="mb-5 flex items-start gap-2 rounded-lg border border-destructive/20 bg-destructive/5 p-3 text-sm text-destructive"
				>
					<TriangleAlert className="mt-0.5 size-4 shrink-0" />
					<span>{error}</span>
				</div>
			)}

			<form onSubmit={handleEmailSignup} className="space-y-5">
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
						placeholder="At least 8 characters"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						autoComplete="new-password"
					/>
				</div>

				<div className="field">
					<Label htmlFor="confirm-password">Confirm password</Label>
					<Input
						id="confirm-password"
						type="password"
						placeholder="Re-enter your password"
						value={confirmPassword}
						onChange={(e) => setConfirmPassword(e.target.value)}
						autoComplete="new-password"
					/>
				</div>

				<Button type="submit" disabled={loading} className="mt-2 w-full" size="lg">
					{loading ? (
						<>
							<LoadingSpinner size="sm" /> Creating account…
						</>
					) : (
						<>
							Create account
							<ArrowRight />
						</>
					)}
				</Button>
			</form>
		</AuthLayout>
	);
}
