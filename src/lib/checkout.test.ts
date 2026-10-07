import { describe, expect, it } from "vitest";
import { resolveBumpSelection, validateCoupon, type CouponRecord } from "./checkout";

describe("resolveBumpSelection", () => {
  it("keeps only bump ids that belong to the product", () => {
    const allowed = ["bump-1", "bump-2"];
    expect(resolveBumpSelection(allowed, ["bump-1", "unrelated-product-id"])).toEqual(["bump-1"]);
  });

  it("drops an unrelated product id entirely (anti price-injection)", () => {
    expect(resolveBumpSelection(["bump-1"], ["some-other-products-id"])).toEqual([]);
  });

  it("de-duplicates repeated ids", () => {
    expect(resolveBumpSelection(["bump-1"], ["bump-1", "bump-1"])).toEqual(["bump-1"]);
  });

  it("returns an empty array when nothing was requested", () => {
    expect(resolveBumpSelection(["bump-1"], [])).toEqual([]);
  });
});

describe("validateCoupon", () => {
  const base: CouponRecord = {
    type: "percent",
    value: 10,
    isActive: true,
    usedCount: 0,
  };

  it("returns null when there is no coupon", () => {
    expect(validateCoupon(null, "product-1")).toBeNull();
  });

  it("accepts an active, unrestricted coupon", () => {
    expect(validateCoupon(base, "product-1")).toEqual({ type: "percent", value: 10 });
  });

  it("rejects an inactive coupon", () => {
    expect(validateCoupon({ ...base, isActive: false }, "product-1")).toBeNull();
  });

  it("rejects an expired coupon", () => {
    const now = new Date("2026-01-15");
    const expired = { ...base, expiresAt: new Date("2026-01-01") };
    expect(validateCoupon(expired, "product-1", now)).toBeNull();
  });

  it("accepts a coupon that expires in the future", () => {
    const now = new Date("2026-01-01");
    const stillValid = { ...base, expiresAt: new Date("2026-01-15") };
    expect(validateCoupon(stillValid, "product-1", now)).toEqual({ type: "percent", value: 10 });
  });

  it("rejects a coupon that has hit its max uses", () => {
    const exhausted = { ...base, maxUses: 5, usedCount: 5 };
    expect(validateCoupon(exhausted, "product-1")).toBeNull();
  });

  it("accepts a coupon under its max uses", () => {
    const underLimit = { ...base, maxUses: 5, usedCount: 4 };
    expect(validateCoupon(underLimit, "product-1")).toEqual({ type: "percent", value: 10 });
  });

  it("rejects a coupon restricted to other products", () => {
    const restricted = { ...base, productIds: ["product-2", "product-3"] };
    expect(validateCoupon(restricted, "product-1")).toBeNull();
  });

  it("accepts a coupon restricted to a list that includes this product", () => {
    const restricted = { ...base, productIds: ["product-1", "product-2"] };
    expect(validateCoupon(restricted, "product-1")).toEqual({ type: "percent", value: 10 });
  });
});
