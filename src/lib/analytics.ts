"use client";

type AnalyticsPayload = {
  event: string;
  data?: Record<string, string | number | boolean | null>;
};

export function trackEvent(event: string, data?: AnalyticsPayload["data"]) {
  try {
    const pathname = typeof window !== "undefined" ? window.location.pathname : "";
    const payload: AnalyticsPayload = {
      event,
      data: { ...(data ?? {}), _path: pathname },
    };
    const body = JSON.stringify(payload);
    const headers = {
      "Content-Type": "application/json",
      "x-pathname": typeof window !== "undefined" ? window.location.pathname : "",
    };

    if (typeof navigator !== "undefined" && typeof navigator.sendBeacon === "function") {
      const blob = new Blob([body], { type: "application/json" });
      navigator.sendBeacon("/api/track", blob);
      return;
    }

    void fetch("/api/track", {
      method: "POST",
      headers,
      body,
      keepalive: true,
    });
  } catch {
    // Ignore analytics failures
  }
}
