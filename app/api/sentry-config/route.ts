import sentryConfig from "@/sentry.config";
import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.json(sentryConfig);
}
