import { describe, expect, it } from "vitest";
import { bareHostname, resolveCanonicalRedirect } from "@/lib/canonical-host";

describe("bareHostname", () => {
  it("odstraní www", () => {
    expect(bareHostname("WWW.Example.CZ")).toBe("example.cz");
    expect(bareHostname("example.cz")).toBe("example.cz");
  });
});

describe("resolveCanonicalRedirect", () => {
  const canonical = new URL("https://qapi.cz");

  it("localhost neřeší", () => {
    const req = new URL("http://localhost:3000/kosik");
    expect(resolveCanonicalRedirect("localhost:3000", req, canonical)).toEqual({ action: "next" });
  });

  it("www → apex + https", () => {
    const req = new URL("http://www.qapi.cz/produkty/foo");
    expect(resolveCanonicalRedirect("www.qapi.cz", req, canonical)).toEqual({
      action: "redirect",
      hostname: "qapi.cz",
      protocol: "https:",
    });
  });

  it("apex už je v pořádku", () => {
    const req = new URL("https://qapi.cz/kosik");
    expect(resolveCanonicalRedirect("qapi.cz", req, canonical)).toEqual({ action: "next" });
  });

  it("kanonická s www → doplní www", () => {
    const c = new URL("https://www.example.com");
    const req = new URL("https://example.com/");
    expect(resolveCanonicalRedirect("example.com", req, c)).toEqual({
      action: "redirect",
      hostname: "www.example.com",
      protocol: "https:",
    });
  });
});
