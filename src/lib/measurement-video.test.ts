import { describe, expect, it } from "vitest";
import { toMeasurementVideoEmbedSrc } from "@/lib/measurement-video";

describe("toMeasurementVideoEmbedSrc", () => {
  it("normalizes youtube watch URL", () => {
    expect(toMeasurementVideoEmbedSrc("https://www.youtube.com/watch?v=dQw4w9WgXcQ")).toBe(
      "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ",
    );
  });

  it("normalizes youtu.be", () => {
    expect(toMeasurementVideoEmbedSrc("https://youtu.be/dQw4w9WgXcQ")).toBe(
      "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ",
    );
  });

  it("normalizes vimeo", () => {
    expect(toMeasurementVideoEmbedSrc("https://vimeo.com/123456789")).toBe("https://player.vimeo.com/video/123456789");
  });

  it("passes through existing embed URL", () => {
    expect(toMeasurementVideoEmbedSrc("https://www.youtube-nocookie.com/embed/abc")).toBe(
      "https://www.youtube-nocookie.com/embed/abc",
    );
  });
});
