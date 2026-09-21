import { NextRequest } from "next/server";
import {
  catalog,
  parseAction,
  parseConfigure,
  parsePerform,
  runConfigure,
  runPerform,
  runSetup,
  snapshot,
} from "@/lib/bridge/actions";
import { authorizeBridgeRequest, corsHeaders, isBridgeConfigured } from "@/lib/bridge/auth";
import { toolNameToRequest } from "@/lib/bridge/tools";

export const runtime = "nodejs";
export const maxDuration = 120;

function json(body: unknown, status = 200) {
  return Response.json(body, { status, headers: corsHeaders() });
}

function requireAuth(request: Request) {
  if (!isBridgeConfigured()) {
    return json(
      {
        ok: false,
        error:
          "GROK_BRIDGE_SECRET is not set. Copy .env.example to .env.local and restart next dev.",
      },
      503,
    );
  }
  if (!authorizeBridgeRequest(request)) {
    return json({ ok: false, error: "Unauthorized" }, 401);
  }
  return null;
}

async function dispatch(actionName: string, params: unknown) {
  const action = parseAction(actionName);
  if (!action) {
    return json(
      {
        ok: false,
        error: `Unknown action. Use one of: ${catalog().actions.join(", ")}`,
      },
      400,
    );
  }

  if (action === "list") {
    return json({ ok: true, ...(await snapshot()) });
  }

  if (action === "setup") {
    return json({ ok: true, result: await runSetup() });
  }

  if (action === "configure") {
    const parsed = parseConfigure(params);
    if ("error" in parsed) return json({ ok: false, error: parsed.error }, 400);
    return json({ ok: true, config: await runConfigure(parsed) });
  }

  const parsed = parsePerform(params);
  if ("error" in parsed) return json({ ok: false, error: parsed.error }, 400);
  const result = await runPerform(parsed);
  const ok = "ok" in result ? result.ok : true;
  return json({ ok, result }, ok ? 200 : 400);
}

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders() });
}

export async function GET(request: NextRequest) {
  const denied = requireAuth(request);
  if (denied) return denied;
  return json({ ok: true, ...(await snapshot()) });
}

export async function POST(request: NextRequest) {
  const denied = requireAuth(request);
  if (denied) return denied;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, error: "JSON body required" }, 400);
  }

  if (typeof body !== "object" || body === null) {
    return json({ ok: false, error: "JSON object required" }, 400);
  }

  const payload = body as {
    action?: unknown;
    params?: unknown;
    tool?: unknown;
    arguments?: unknown;
  };

  if (typeof payload.tool === "string") {
    const mapped = toolNameToRequest(
      payload.tool,
      typeof payload.arguments === "object" && payload.arguments !== null
        ? (payload.arguments as Record<string, unknown>)
        : {},
    );
    if (!mapped) {
      return json({ ok: false, error: `Unknown tool ${payload.tool}` }, 400);
    }
    return dispatch(mapped.action, mapped.params);
  }

  if (typeof payload.action !== "string") {
    return json({ ok: false, error: "action is required" }, 400);
  }

  return dispatch(payload.action, payload.params);
}
