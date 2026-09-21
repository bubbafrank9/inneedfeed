import { NextRequest } from "next/server";
import { authorizeBridgeRequest, corsHeaders, isBridgeConfigured } from "@/lib/bridge/auth";
import { openApiDocument } from "@/lib/bridge/tools";

export const runtime = "nodejs";

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders() });
}

export async function GET(request: NextRequest) {
  if (!isBridgeConfigured() || !authorizeBridgeRequest(request)) {
    return Response.json({ ok: false, error: "Unauthorized" }, { status: 401, headers: corsHeaders() });
  }
  const origin =
    process.env.BRIDGE_PUBLIC_URL ||
    request.headers.get("origin") ||
    request.nextUrl.origin;
  return Response.json(openApiDocument(origin), { headers: corsHeaders() });
}
