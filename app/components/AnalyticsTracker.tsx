"use client";

import { useEffect } from "react";

type AnalyticsEventName =
  | "contact_click"
  | "cta_click"
  | "discord_click"
  | "mod_tool_download"
  | "page_view"
  | "press_kit_click"
  | "social_click"
  | "steam_review_click"
  | "steam_store_click";

type AnalyticsPayload = {
  destination: string;
  event: AnalyticsEventName;
  game: string;
  label: string;
  path: string;
  placement: string;
};

const trackedLinkSelector = "a.button, a.text-link, a[data-track-event]";

function getGame(path: string, href = "") {
  const value = `${path} ${href}`.toLowerCase();

  if (value.includes("game-store-chronicle") || value.includes("3463400") || value.includes("gsc-mod-studio")) {
    return "gsc";
  }

  if (value.includes("veil-of-shadows") || value.includes("2613120")) {
    return "vos";
  }

  return "studio";
}

function getPlacement(link: HTMLAnchorElement) {
  const explicitPlacement = link.dataset.trackPlacement;
  if (explicitPlacement) return explicitPlacement;

  if (link.closest(".steam-review")) return "review_prompt";
  if (link.closest(".game-hero")) return "hero";
  if (link.closest(".game-details")) return "details";
  if (link.closest(".gsc-community")) return "community";
  if (link.closest(".game-portal--gsc")) return "home_gsc_card";
  if (link.closest(".game-portal--vos")) return "home_vos_card";
  if (link.closest(".studio-note")) return "home_studio_prompt";
  if (link.closest(".site-footer")) return "footer";
  if (link.closest(".site-header")) return "header";

  return link.closest("section")?.id || "page";
}

function classifyLink(link: HTMLAnchorElement) {
  const url = new URL(link.href, window.location.origin);
  const host = url.hostname.toLowerCase();
  const href = url.href.toLowerCase();

  if (href.includes("gsc-mod-studio") && href.endsWith(".zip")) {
    return { destination: "r2_download", event: "mod_tool_download" as const };
  }

  if (host === "store.steampowered.com" && url.pathname.includes("/recommended/recommendgame/")) {
    return { destination: "steam", event: "steam_review_click" as const };
  }

  if (host === "store.steampowered.com") {
    return { destination: "steam", event: "steam_store_click" as const };
  }

  if (host === "discord.gg") {
    return { destination: "discord", event: "discord_click" as const };
  }

  if (host === "impress.games") {
    return { destination: "press_kit", event: "press_kit_click" as const };
  }

  if (url.protocol === "mailto:") {
    return { destination: "email", event: "contact_click" as const };
  }

  if (host === "x.com" || host === "www.x.com" || host === "youtube.com" || host === "www.youtube.com") {
    return { destination: host.includes("youtube") ? "youtube" : "x", event: "social_click" as const };
  }

  return {
    destination: url.origin === window.location.origin ? "internal" : "external",
    event: "cta_click" as const,
  };
}

function sendAnalyticsEvent(payload: AnalyticsPayload) {
  const body = JSON.stringify(payload);

  if (navigator.sendBeacon) {
    const queued = navigator.sendBeacon(
      "/api/analytics",
      new Blob([body], { type: "application/json" }),
    );

    if (queued) return;
  }

  void fetch("/api/analytics", {
    body,
    headers: { "Content-Type": "application/json" },
    keepalive: true,
    method: "POST",
  });
}

export function AnalyticsTracker() {
  useEffect(() => {
    const path = window.location.pathname;

    sendAnalyticsEvent({
      destination: "internal",
      event: "page_view",
      game: getGame(path),
      label: document.title.slice(0, 100),
      path,
      placement: "page",
    });

    const handleClick = (event: MouseEvent) => {
      if (!(event.target instanceof Element)) return;

      const link = event.target.closest<HTMLAnchorElement>(trackedLinkSelector);
      if (!link) return;

      const classified = classifyLink(link);
      const href = link.getAttribute("href") ?? "";
      const label = (link.dataset.trackLabel ?? link.textContent ?? "link")
        .replace(/\s+/g, " ")
        .trim()
        .slice(0, 100);

      sendAnalyticsEvent({
        ...classified,
        game: getGame(path, href),
        label,
        path,
        placement: getPlacement(link),
      });
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  return null;
}
