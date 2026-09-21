import { NextRequest } from "next/server";
import { authorizeBridgeRequest, corsHeaders, isBridgeConfigured } from "@/lib/bridge/auth";
import { grokFunctionTools } from "@/lib/bridge/tools";

export const runtime = "nodejs";

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders() });
}

export async function GET(request: NextRequest) {
  if (!isBridgeConfigured() || !authorizeBridgeRequest(request)) {
    return Response.json({ ok: false, error: "Unauthorized" }, { status: 401, headers: corsHeaders() });
  }
  return Response.json(
    { ok: true, tools: grokFunctionTools() },
    { headers: corsHeaders() },
  );
}
