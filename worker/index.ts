/** Cloudflare Worker entry point for the vinext-starter template. */
import { handleImageOptimization, DEFAULT_DEVICE_SIZES, DEFAULT_IMAGE_SIZES } from "vinext/server/image-optimization";
import handler from "vinext/server/app-router-entry";

interface AnalyticsEngineDatasetBinding {
  writeDataPoint(dataPoint: {
    blobs?: string[];
    doubles?: number[];
    indexes?: string[];
  }): void;
}

interface Env {
  ANALYTICS_ENGINE?: AnalyticsEngineDatasetBinding;
  ASSETS: Fetcher;
  DB: D1Database;
  IMAGES: {
    input(stream: ReadableStream): {
      transform(options: Record<string, unknown>): {
        output(options: { format: string; quality: number }): Promise<{ response(): Response }>;
      };
    };
  };
}

interface ExecutionContext {
  waitUntil(promise: Promise<unknown>): void;
  passThroughOnException(): void;
}

const ANALYTICS_EVENTS = new Set([
  "contact_click",
  "cta_click",
  "discord_click",
  "mod_tool_download",
  "page_view",
  "press_kit_click",
  "social_click",
  "steam_news_click",
  "steam_review_click",
  "steam_store_click",
]);

function cleanDimension(value: unknown, fallback: string, maxLength = 100) {
  if (typeof value !== "string") return fallback;

  const cleaned = value.replace(/\s+/g, " ").trim();
  return cleaned ? cleaned.slice(0, maxLength) : fallback;
}

async function recordAnalyticsEvent(request: Request, env: Env, url: URL) {
  if (request.method !== "POST") {
    return new Response("Method not allowed", {
      headers: { Allow: "POST" },
      status: 405,
    });
  }

  const origin = request.headers.get("Origin");
  if (origin && origin !== url.origin) {
    return new Response("Forbidden", { status: 403 });
  }

  const contentLength = Number(request.headers.get("Content-Length") ?? 0);
  if (contentLength > 4096) {
    return new Response("Payload too large", { status: 413 });
  }

  try {
    const rawBody = await request.text();
    if (rawBody.length > 4096) {
      return new Response("Payload too large", { status: 413 });
    }

    const payload = JSON.parse(rawBody) as Record<string, unknown>;
    const event = cleanDimension(payload.event, "unknown", 48);

    if (!ANALYTICS_EVENTS.has(event)) {
      return new Response("Invalid event", { status: 400 });
    }

    env.ANALYTICS_ENGINE?.writeDataPoint({
      // blob1 event, blob2 path, blob3 game, blob4 placement,
      // blob5 label, blob6 destination; double1 is the event count.
      blobs: [
        event,
        cleanDimension(payload.path, "/", 180),
        cleanDimension(payload.game, "studio", 32),
        cleanDimension(payload.placement, "page", 64),
        cleanDimension(payload.label, "unknown", 100),
        cleanDimension(payload.destination, "unknown", 48),
      ],
      doubles: [1],
      indexes: [url.hostname.slice(0, 96)],
    });

    return new Response(null, {
      headers: { "Cache-Control": "no-store" },
      status: 204,
    });
  } catch {
    return new Response("Invalid payload", { status: 400 });
  }
}

// Image security config. SVG sources with .svg extension auto-skip the
// optimization endpoint on the client side (served directly, no proxy).
// To route SVGs through the optimizer (with security headers), set
// dangerouslyAllowSVG: true in next.config.js and uncomment below:
// const imageConfig: ImageConfig = { dangerouslyAllowSVG: true };

const worker = {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/_vinext/image") {
      const allowedWidths = [...DEFAULT_DEVICE_SIZES, ...DEFAULT_IMAGE_SIZES];
      return handleImageOptimization(request, {
        fetchAsset: (path) => env.ASSETS.fetch(new Request(new URL(path, request.url))),
        transformImage: async (body, { width, format, quality }) => {
          const result = await env.IMAGES.input(body).transform(width > 0 ? { width } : {}).output({ format, quality });
          return result.response();
        },
      }, allowedWidths);
    }

    if (url.pathname === "/api/analytics") {
      return recordAnalyticsEvent(request, env, url);
    }

    return handler.fetch(request, env, ctx);
  },
};

export default worker;
