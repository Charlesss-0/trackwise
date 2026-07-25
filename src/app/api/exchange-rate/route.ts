import { NextResponse } from "next/server";

const EXCHANGE_API_URL = "https://open.er-api.com/v6/latest/USD";

const FALLBACK_RATE = 36.5;

/** Cache this route's response for 6 hours. */
export const revalidate = 21600;

interface ExchangeAPIResponse {
  result: string;
  rates: Record<string, number>;
}

/**
 * GET /api/exchange-rate
 *
 * Fetches the current USD → NIO exchange rate from a free public API.
 * Returns a JSON object with `rate` (NIO per 1 USD) and `fetchedAt` (ISO timestamp).
 *
 * Falls back to a hardcoded rate of 36.5 if the upstream API is unavailable.
 */
export async function GET() {
  try {
    const response = await fetch(EXCHANGE_API_URL, {
      next: { revalidate: 21600 },
    });

    if (!response.ok) {
      throw new Error(`Exchange API responded with status ${response.status}`);
    }

    const data: ExchangeAPIResponse = await response.json();

    if (data.result !== "success" || !data.rates?.NIO) {
      throw new Error("Unexpected exchange API response format");
    }

    return NextResponse.json({
      rate: data.rates.NIO,
      fetchedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Failed to fetch exchange rate, using fallback:", error instanceof Error ? error.message : error);

    return NextResponse.json({
      rate: FALLBACK_RATE,
      fetchedAt: new Date().toISOString(),
    });
  }
}
