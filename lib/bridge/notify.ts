export async function notifyGrokBot(payload: unknown): Promise<{
  ok: boolean;
  status?: number;
  error?: string;
}> {
  const url = process.env.GROK_BOT_WEBHOOK_URL;
  const key = process.env.GROK_BOT_WEBHOOK_KEY;
  if (!url) {
    return {
      ok: false,
      error: "GROK_BOT_WEBHOOK_URL is not set. Paste the routine webhook from Grok Bot.",
    };
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (key) {
    headers.Authorization = `Bearer ${key}`;
  }

  const response = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    return {
      ok: false,
      status: response.status,
      error: text.slice(0, 500) || `Grok Bot webhook returned ${response.status}`,
    };
  }

  return { ok: true, status: response.status };
}
