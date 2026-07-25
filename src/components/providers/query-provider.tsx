"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { type ReactNode, useState } from "react";

interface QueryProviderProps {
  children: ReactNode;
}

/**
 * Wraps the app in TanStack React Query's QueryClientProvider.
 *
 * The QueryClient is created inside useState so each browser session gets its
 * own cache and the client is never shared across requests during SSR.
 */
export function QueryProvider({ children }: QueryProviderProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Don't refetch on window focus in dev to reduce noise
            refetchOnWindowFocus: false,
            // Keep data fresh for 1 minute before auto-refetching
            staleTime: 60 * 1000,
            // Retry failed requests once
            retry: 1,
          },
        },
      }),
  );

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
