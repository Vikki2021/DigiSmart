import { describe, expect, it } from "vitest";
import { getBrandName } from "./env";

describe("getBrandName", () => {
  it("falls back to the default brand when BRAND_NAME is unset", () => {
    delete process.env.BRAND_NAME;
    expect(getBrandName()).toBe("SmartAiGuides");
  });

  it("reads BRAND_NAME from the environment when set", () => {
    process.env.BRAND_NAME = "TestBrand";
    expect(getBrandName()).toBe("TestBrand");
    delete process.env.BRAND_NAME;
  });
});
