import sentryConfig from "@/sentry.config";
import { NextResponse } from "next/server";

// Force the route to be dynamic so that the environment variables that hold
// Sentry information aren't inlined at build-time.
export const dynamic = "force-dynamic";

// Use _req so the function isn't evaluated at build time and can load the
// variables dynamically.
export async function GET() {
  const config = sentryConfig();

  return NextResponse.json(config);
}
