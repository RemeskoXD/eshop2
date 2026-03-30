/** Host bez portu, lower case. */
export function hostnameOnly(host: string): string {
  return (host.split(":")[0] ?? "").toLowerCase();
}

/** Porovnání „stejná doména“ bez ohledu na předponu www. */
export function bareHostname(host: string): string {
  const h = hostnameOnly(host);
  return h.startsWith("www.") ? h.slice(4) : h;
}

export function parseCanonicalSiteUrl(rawEnv?: string): URL | null {
  const raw = (rawEnv || process.env.NEXT_PUBLIC_SITE_URL || "https://qapi.cz").trim().replace(/\/$/, "");
  const withProto = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
  try {
    return new URL(withProto);
  } catch {
    return null;
  }
}

export type CanonicalRedirectResult =
  | { action: "next" }
  | { action: "redirect"; hostname: string; protocol: "https:" | "http:" };

/**
 * Čistá logika pro middleware: stejná „base“ doména jako kanonická URL → sjednotit hostitele a případně https.
 */
export function resolveCanonicalRedirect(
  hostHeader: string | null,
  pathUrl: URL,
  canonical: URL,
): CanonicalRedirectResult {
  const canonicalHost = hostnameOnly(canonical.hostname);
  const canonicalBare = bareHostname(canonicalHost);

  const requestHost = hostnameOnly(hostHeader ?? "");
  const requestBare = bareHostname(requestHost);

  if (!requestHost || requestBare !== canonicalBare) {
    return { action: "next" };
  }

  const nextProto = canonical.protocol === "https:" ? "https:" : "http:";
  const needHost = requestHost !== canonicalHost;
  const needHttps = canonical.protocol === "https:" && pathUrl.protocol === "http:";

  if (!needHost && !needHttps) {
    return { action: "next" };
  }

  return {
    action: "redirect",
    hostname: canonicalHost,
    protocol: nextProto,
  };
}
