---
name: inneedfeed-bridge
description: Set up, configure, and run Inneedfeed through its authenticated HTTP bridge. Use when the user wants the Grok Bot to operate Inneedfeed, add feed items, ping the app, notify this bot, or launch a Cursor cloud agent.
---

# Inneedfeed Grok Bridge

You operate Inneedfeed by calling its bridge. Do not guess filesystem paths or run unrelated shell. Use only the actions below.

## Auth

Every request needs:

```
Authorization: Bearer $GROK_BRIDGE_SECRET
Content-Type: application/json
```

Base URL is `$BRIDGE_PUBLIC_URL` (must be public HTTPS; localhost is unreachable from Grok Bot cloud).

## Endpoints

- `GET {base}/api/bridge` — catalog, config, feed, recent activities
- `POST {base}/api/bridge` — invoke an action
- `GET {base}/api/bridge/tools` — xAI function-tool definitions
- `GET {base}/api/bridge/openapi` — OpenAPI document

## Invoke

```json
{
  "action": "list" | "setup" | "configure" | "perform",
  "params": {}
}
```

You may also send xAI-style tool names:

```json
{
  "tool": "inneedfeed_perform",
  "arguments": { "activity": "ping" }
}
```

### setup

Initialize the data store and report which env vars are present (values are never returned).

```json
{ "action": "setup" }
```

### configure

```json
{
  "action": "configure",
  "params": {
    "title": "Inneedfeed",
    "tagline": "Needs, offers, and follow-ups",
    "timezone": "America/Chicago",
    "features": { "feed": true, "cursorAgent": true, "notifyGrok": true }
  }
}
```

### perform activities

| activity | required params | what it does |
| --- | --- | --- |
| `ping` | — | Health check |
| `log` | `message` | Append an activity log entry |
| `add_feed_item` | `title`, optional `body` | Publish a feed item |
| `list_feed` | — | Read the feed |
| `notify_grok` | optional `message` | POST back to this bot's routine webhook |
| `cursor_agent` | `prompt`, optional `name` | Launch a Cursor cloud agent |

Example:

```json
{
  "action": "perform",
  "params": {
    "activity": "add_feed_item",
    "title": "Need a ride to the clinic Thursday",
    "body": "South Austin, 10am window."
  }
}
```

Launch Cursor work:

```json
{
  "action": "perform",
  "params": {
    "activity": "cursor_agent",
    "name": "Feed UI",
    "prompt": "Add a simple public feed page using data/feed.json. Do not expose secrets."
  }
}
```

## Guardrails

- Never print `GROK_BRIDGE_SECRET`, `CURSOR_API_KEY`, or webhook keys.
- If a call returns 503, tell the user to set `GROK_BRIDGE_SECRET` in Inneedfeed `.env.local`.
- If a call returns 401, the bearer token is wrong.
- If setup says the URL is localhost, tell the user to tunnel or deploy before you can keep calling it.
- Prefer `setup` once, then `configure`, then `perform`.
