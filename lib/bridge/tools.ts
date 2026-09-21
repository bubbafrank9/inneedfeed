export function grokFunctionTools() {
  return [
    {
      type: "function",
      name: "inneedfeed_list",
      description:
        "List Inneedfeed bridge actions, activities, and current app config snapshot.",
      parameters: { type: "object", properties: {}, additionalProperties: false },
    },
    {
      type: "function",
      name: "inneedfeed_setup",
      description:
        "Initialize the Inneedfeed data store and report which env vars are ready for Grok Bot and Cursor.",
      parameters: { type: "object", properties: {}, additionalProperties: false },
    },
    {
      type: "function",
      name: "inneedfeed_configure",
      description: "Update Inneedfeed title, tagline, timezone, or feature flags.",
      parameters: {
        type: "object",
        properties: {
          title: { type: "string", description: "App title" },
          tagline: { type: "string", description: "Short description" },
          timezone: { type: "string", description: "IANA timezone, e.g. America/Chicago" },
          features: {
            type: "object",
            properties: {
              feed: { type: "boolean" },
              cursorAgent: { type: "boolean" },
              notifyGrok: { type: "boolean" },
            },
          },
        },
      },
    },
    {
      type: "function",
      name: "inneedfeed_perform",
      description:
        "Run a named Inneedfeed activity: ping, log, add_feed_item, list_feed, notify_grok, or cursor_agent.",
      parameters: {
        type: "object",
        properties: {
          activity: {
            type: "string",
            enum: [
              "ping",
              "log",
              "add_feed_item",
              "list_feed",
              "notify_grok",
              "cursor_agent",
            ],
          },
          message: { type: "string" },
          title: { type: "string", description: "Required for add_feed_item" },
          body: { type: "string" },
          prompt: { type: "string", description: "Required for cursor_agent" },
          name: { type: "string", description: "Optional Cursor agent display name" },
        },
        required: ["activity"],
      },
    },
  ];
}

export function openApiDocument(baseUrl: string) {
  return {
    openapi: "3.1.0",
    info: {
      title: "Inneedfeed Grok Bridge",
      version: "0.1.0",
      description:
        "Authenticated actions so a Grok Bot can set up, configure, and operate Inneedfeed.",
    },
    servers: [{ url: baseUrl }],
    paths: {
      "/api/bridge": {
        get: {
          operationId: "inneedfeed_list",
          summary: "List actions and current snapshot",
          security: [{ bearerAuth: [] }],
          responses: { "200": { description: "Snapshot" } },
        },
        post: {
          operationId: "inneedfeed_invoke",
          summary: "Run setup, configure, or perform",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["action"],
                  properties: {
                    action: {
                      type: "string",
                      enum: ["list", "setup", "configure", "perform"],
                    },
                    params: { type: "object" },
                  },
                },
              },
            },
          },
          responses: { "200": { description: "Action result" } },
        },
      },
    },
    components: {
      securitySchemes: {
        bearerAuth: { type: "http", scheme: "bearer" },
      },
    },
  };
}

export function toolNameToRequest(name: string, args: Record<string, unknown>) {
  switch (name) {
    case "inneedfeed_list":
      return { action: "list" as const, params: {} };
    case "inneedfeed_setup":
      return { action: "setup" as const, params: {} };
    case "inneedfeed_configure":
      return { action: "configure" as const, params: args };
    case "inneedfeed_perform":
      return { action: "perform" as const, params: args };
    default:
      return null;
  }
}
