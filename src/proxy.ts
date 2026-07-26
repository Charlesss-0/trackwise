import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

/**
 * Middleware that:
 * 1. Refreshes the Supabase auth session on every matched request.
 * 2. Protects /dashboard/* routes — redirects unauthenticated users to /auth/login.
 * 3. Redirects authenticated users away from /auth/login and /auth/signup to /dashboard.
 */
export async function proxy(request: NextRequest) {
	let supabaseResponse = NextResponse.next({
		request,
	});

	const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL as string, process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY as string, {
		cookies: {
			getAll() {
				return request.cookies.getAll();
			},
			setAll(cookiesToSet) {
				for (const { name, value } of cookiesToSet) {
					request.cookies.set(name, value);
				}
				supabaseResponse = NextResponse.next({
					request,
				});
				for (const { name, value, options } of cookiesToSet) {
					supabaseResponse.cookies.set(name, value, options);
				}
			},
		},
	});

	// IMPORTANT: Do not use `supabase.auth.getSession()` here.
	// getUser() sends a request to the Supabase Auth server every time to
	// revalidate the token, which is the secure pattern for middleware.
	const {
		data: { user },
	} = await supabase.auth.getUser();

	const { pathname } = request.nextUrl;

	if (pathname.startsWith("/dashboard") && !user) {
		const loginUrl = request.nextUrl.clone();
		loginUrl.pathname = "/auth/login";

		return NextResponse.redirect(loginUrl);
	}

	if ((pathname === "/auth/login" || pathname === "/auth/signup") && user) {
		const dashboardUrl = request.nextUrl.clone();
		dashboardUrl.pathname = "/dashboard";

		return NextResponse.redirect(dashboardUrl);
	}

	return supabaseResponse;
}

export const config = {
	matcher: [
		/*
		 * Match all request paths EXCEPT:
		 *  - _next/static (static files)
		 *  - _next/image  (image optimization)
		 *  - favicon.ico  (browser icon)
		 *  - Public assets (svg, png, jpg, etc.)
		 */
		"/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
	],
};
