import { readActivities, readConfig, readFeed } from "@/lib/bridge/store";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [config, feed, activities] = await Promise.all([
    readConfig(),
    readFeed(),
    readActivities(8),
  ]);
  const secretReady = Boolean(process.env.GROK_BRIDGE_SECRET);
  const webhookReady = Boolean(process.env.GROK_BOT_WEBHOOK_URL);
  const cursorReady = Boolean(process.env.CURSOR_API_KEY);

  return (
    <div className="flex flex-1 flex-col bg-zinc-50 font-sans text-zinc-950 dark:bg-black dark:text-zinc-50">
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-10 px-6 py-16">
        <header className="flex flex-col gap-3">
          <p className="text-sm font-medium uppercase tracking-wide text-zinc-500">
            Grok Bot bridge
          </p>
          <h1 className="text-4xl font-semibold tracking-tight">{config.title}</h1>
          <p className="max-w-xl text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            {config.tagline}
          </p>
        </header>

        <section className="grid gap-3 sm:grid-cols-3">
          <StatusCard label="Bridge secret" ready={secretReady} />
          <StatusCard label="Grok webhook" ready={webhookReady} />
          <StatusCard label="Cursor API" ready={cursorReady} />
        </section>

        <section className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
          <h2 className="text-lg font-semibold">How the bot connects</h2>
          <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
            <li>
              Copy <code className="font-mono">.env.example</code> to{" "}
              <code className="font-mono">.env.local</code> and set{" "}
              <code className="font-mono">GROK_BRIDGE_SECRET</code>.
            </li>
            <li>
              Paste <code className="font-mono">skills/inneedfeed-bridge/SKILL.md</code>{" "}
              into the Grok Bot skill library.
            </li>
            <li>
              Point the bot at your public URL, then ask it to run{" "}
              <code className="font-mono">setup</code>,{" "}
              <code className="font-mono">configure</code>, and activities.
            </li>
          </ol>
        </section>

        {config.features.feed ? (
          <section className="flex flex-col gap-4">
            <h2 className="text-lg font-semibold">Feed</h2>
            {feed.length === 0 ? (
              <p className="text-sm text-zinc-500">
                Empty. Ask the Grok Bot to perform <code>add_feed_item</code>.
              </p>
            ) : (
              <ul className="flex flex-col gap-3">
                {feed.map((item) => (
                  <li
                    key={item.id}
                    className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950"
                  >
                    <p className="font-medium">{item.title}</p>
                    {item.body ? (
                      <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                        {item.body}
                      </p>
                    ) : null}
                    <p className="mt-2 text-xs text-zinc-400">
                      {item.source} · {item.createdAt}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </section>
        ) : null}

        <section className="flex flex-col gap-4">
          <h2 className="text-lg font-semibold">Recent activities</h2>
          {activities.length === 0 ? (
            <p className="text-sm text-zinc-500">No bridge calls yet.</p>
          ) : (
            <ul className="flex flex-col gap-2 text-sm">
              {activities.map((entry) => (
                <li
                  key={entry.id}
                  className="flex flex-col rounded-lg border border-zinc-200 px-4 py-3 dark:border-zinc-800"
                >
                  <span className="font-medium">
                    {entry.ok ? "ok" : "failed"} · {entry.action}
                    {entry.activity ? ` / ${entry.activity}` : ""}
                  </span>
                  <span className="text-zinc-500">{entry.summary}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}

function StatusCard({ label, ready }: { label: string; ready: boolean }) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm dark:border-zinc-800 dark:bg-zinc-950">
      <p className="text-zinc-500">{label}</p>
      <p className="mt-1 font-medium">{ready ? "Configured" : "Not set"}</p>
    </div>
  );
}
