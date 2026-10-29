// protocol-ai: passes Insights requests from the tracker to Claude and sends the answer back.
//
// Secrets (Cloudflare: Workers & Pages → protocol-ai → Settings → Runtime → Variables and Secrets):
//   APP_KEY            the access key typed into the tracker (Insights → AI connection)
//   ANTHROPIC_API_KEY  the Anthropic API key
// Optional variable:
//   MODEL              model to use when the app doesn't ask for one (default below)

const DEFAULT_MODEL = "claude-haiku-5-5";
const ALLOWED_MODELS = ["claude-haiku-5-5", "claude-sonnet-5-5"];
const MAX_TOKENS = 8000;
const ALLOWED_ORIGINS = [
  "https://my.korahpeptides.com",
  "https://app.korahpeptides.com",
  "https://public-peptide-tracker.korahpeptides.com",
  "https://rickspeptidetracker.rdguindon.workers.dev",
];

function cors(origin) {
  const h = {
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-App-Key",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
  };
  if (ALLOWED_ORIGINS.includes(origin)) h["Access-Control-Allow-Origin"] = origin;
  return h;
}

function reply(status, body, origin) {
  return new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json", ...cors(origin) } });
}

// Compare without leaking how many characters matched.
function sameKey(a, b) {
  if (typeof a !== "string" || typeof b !== "string" || a.length !== b.length) return false;
  let x = 0;
  for (let i = 0; i < a.length; i++) x |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return x === 0;
}

export default {
  async fetch(req, env) {
    const origin = req.headers.get("Origin") || "";
    if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: cors(origin) });
    if (req.method !== "POST") return reply(405, { error: { message: "Use POST." } }, origin);
    if (!env.APP_KEY || !env.ANTHROPIC_API_KEY)
      return reply(500, { error: { message: "The Worker is missing its APP_KEY or ANTHROPIC_API_KEY secret." } }, origin);
    if (!sameKey(req.headers.get("X-App-Key") || "", env.APP_KEY)) return reply(401, { error: { message: "Wrong access key." } }, origin);

    let b;
    try {
      b = await req.json();
    } catch {
      return reply(400, { error: { message: "The request was not valid JSON." } }, origin);
    }

    // Only pass on the fields the app uses, so the Worker can't be used for anything else.
    const model = ALLOWED_MODELS.includes(b.model) ? b.model : env.MODEL || DEFAULT_MODEL;
    const out = {
      model,
      max_tokens: Math.min(Number(b.max_tokens) || 4000, MAX_TOKENS),
      system: b.system,
      messages: b.messages,
      tools: b.tools,
      tool_choice: b.tool_choice,
    };
    if (typeof b.temperature === "number") out.temperature = b.temperature;

    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "content-type": "application/json", "x-api-key": env.ANTHROPIC_API_KEY, "anthropic-version": "2023-06-01" },
      body: JSON.stringify(out),
    });
    return new Response(await res.text(), { status: res.status, headers: { "Content-Type": "application/json", ...cors(origin) } });
  },
};
