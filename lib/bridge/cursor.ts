type CursorLaunchResult = {
  ok: boolean;
  status: number;
  agentId?: string;
  runId?: string;
  error?: string;
  raw?: unknown;
};

export async function launchCursorAgent(input: {
  prompt: string;
  name?: string;
}): Promise<CursorLaunchResult> {
  const apiKey = process.env.CURSOR_API_KEY;
  if (!apiKey) {
    return {
      ok: false,
      status: 400,
      error: "CURSOR_API_KEY is not set. Add it to .env.local.",
    };
  }

  const repo = process.env.CURSOR_REPO_URL;
  const modelId = process.env.CURSOR_MODEL_ID;
  const body: Record<string, unknown> = {
    prompt: { text: input.prompt },
    name: input.name?.slice(0, 100) || "Inneedfeed Grok bridge",
  };

  if (modelId) {
    body.model = { id: modelId };
  }
  if (repo) {
    body.repos = [{ url: repo }];
  }

  const response = await fetch("https://api.cursor.com/v1/agents", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const raw = (await response.json().catch(() => null)) as
    | {
        agent?: { id?: string };
        run?: { id?: string };
        message?: string;
        error?: { message?: string };
      }
    | null;

  if (!response.ok) {
    return {
      ok: false,
      status: response.status,
      error:
        raw?.error?.message ||
        raw?.message ||
        `Cursor API returned ${response.status}`,
      raw,
    };
  }

  return {
    ok: true,
    status: response.status,
    agentId: raw?.agent?.id,
    runId: raw?.run?.id,
    raw,
  };
}
