import { createHmac, timingSafeEqual } from "node:crypto";

export function isBridgeConfigured(): boolean {
  return Boolean(process.env.GROK_BRIDGE_SECRET);
}

export function authorizeBridgeRequest(request: Request): boolean {
  const secret = process.env.GROK_BRIDGE_SECRET;
  if (!secret) return false;

  const header = request.headers.get("authorization") ?? "";
  const token = header.startsWith("Bearer ") ? header.slice(7).trim() : "";
  if (!token) return false;

  const expected = createHmac("sha256", "inneedfeed-bridge").update(secret).digest();
  const provided = createHmac("sha256", "inneedfeed-bridge").update(token).digest();
  return timingSafeEqual(expected, provided);
}

export function corsHeaders(): HeadersInit {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Authorization, Content-Type",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  };
}
