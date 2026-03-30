/** Převede odkaz na YouTube/Vimeo nebo přímo embed URL na src pro iframe. */
export function toMeasurementVideoEmbedSrc(input: string): string | null {
  const raw = input.trim();
  if (!raw) return null;
  try {
    const withProto = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
    const u = new URL(withProto);
    const host = u.hostname.toLowerCase();

    if (host.includes("youtube.com")) {
      const v = u.searchParams.get("v");
      if (v) return `https://www.youtube-nocookie.com/embed/${v}`;
      const m = u.pathname.match(/^\/embed\/([^/?]+)/);
      if (m?.[1]) return `https://www.youtube-nocookie.com/embed/${m[1]}`;
    }
    if (host === "youtu.be") {
      const id = u.pathname.replace(/^\//, "").split("/")[0];
      if (id) return `https://www.youtube-nocookie.com/embed/${id}`;
    }
    if (host.includes("vimeo.com")) {
      const parts = u.pathname.split("/").filter(Boolean);
      const id = parts[0] === "video" ? parts[1] : parts[0];
      if (id && /^\d+$/.test(id)) return `https://player.vimeo.com/video/${id}`;
    }

    if (raw.includes("/embed/")) return raw;
    return null;
  } catch {
    return null;
  }
}

export function getMeasurementVideoEmbedSrcFromEnv(): string | null {
  const raw = (process.env.NEXT_PUBLIC_MEASUREMENT_VIDEO_URL || "").trim();
  if (!raw) return null;
  return toMeasurementVideoEmbedSrc(raw);
}
