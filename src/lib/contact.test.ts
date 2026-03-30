import { describe, expect, it } from "vitest";
import { getPublicContactInfo } from "@/lib/contact";

describe("getPublicContactInfo", () => {
  it("uses defaults when env is missing", () => {
    delete process.env.NEXT_PUBLIC_CONTACT_PHONE;
    delete process.env.NEXT_PUBLIC_CONTACT_EMAIL;
    delete process.env.NEXT_PUBLIC_CONTACT_ADDRESS;

    expect(getPublicContactInfo()).toEqual({
      phoneRaw: "+420 777 000 000",
      phoneHref: "tel:+420777000000",
      email: "objednavky@qapi.cz",
      addressLine: undefined,
    });
  });

  it("normalizes configured phone to tel: value", () => {
    process.env.NEXT_PUBLIC_CONTACT_PHONE = "  +420 777 123 456  ";
    process.env.NEXT_PUBLIC_CONTACT_EMAIL = "podpora@qapi.cz";
    process.env.NEXT_PUBLIC_CONTACT_ADDRESS = "Brno";

    expect(getPublicContactInfo()).toEqual({
      phoneRaw: "+420 777 123 456",
      phoneHref: "tel:+420777123456",
      email: "podpora@qapi.cz",
      addressLine: "Brno",
    });
  });

  it("removes separators and keeps local number when no leading plus", () => {
    process.env.NEXT_PUBLIC_CONTACT_PHONE = " 777/123-456 ";
    process.env.NEXT_PUBLIC_CONTACT_EMAIL = "hello@qapi.cz";
    delete process.env.NEXT_PUBLIC_CONTACT_ADDRESS;

    expect(getPublicContactInfo()).toEqual({
      phoneRaw: "777/123-456",
      phoneHref: "tel:777123456",
      email: "hello@qapi.cz",
      addressLine: undefined,
    });
  });
});
