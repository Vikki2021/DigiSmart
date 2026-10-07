import { describe, expect, it } from "vitest";
import { computeDiscountPaise, computeOrderTotals, formatPaiseAsInr } from "./pricing";

describe("computeDiscountPaise", () => {
  it("returns 0 when there is no coupon", () => {
    expect(computeDiscountPaise(19900, null)).toBe(0);
  });

  it("computes a percent discount, rounded to the nearest paisa", () => {
    // 10% of 14900 = 1490.0 exactly
    expect(computeDiscountPaise(14900, { type: "percent", value: 10 })).toBe(1490);
    // 10% of 9901 = 990.1 -> rounds to 990
    expect(computeDiscountPaise(9901, { type: "percent", value: 10 })).toBe(990);
  });

  it("applies a flat discount directly in paise", () => {
    expect(computeDiscountPaise(29700, { type: "flat", value: 5000 })).toBe(5000);
  });

  it("never discounts below zero, even with an oversized flat coupon", () => {
    expect(computeDiscountPaise(9900, { type: "flat", value: 50000 })).toBe(9900);
  });

  it("never produces a negative discount for a 100%+ percent coupon", () => {
    expect(computeDiscountPaise(9900, { type: "percent", value: 150 })).toBe(9900);
  });

  it("rejects a non-integer or negative subtotal", () => {
    expect(() => computeDiscountPaise(99.5, null)).toThrow();
    expect(() => computeDiscountPaise(-100, null)).toThrow();
  });
});

describe("computeOrderTotals", () => {
  it("sums the product price with bump prices for the subtotal", () => {
    const totals = computeOrderTotals({
      productPricePaise: 9900,
      bumpPricesPaise: [9900, 7900],
    });
    expect(totals).toEqual({ subtotalPaise: 27700, discountPaise: 0, totalPaise: 27700 });
  });

  it("applies a coupon on top of the product + bump subtotal", () => {
    const totals = computeOrderTotals({
      productPricePaise: 14900,
      bumpPricesPaise: [7900],
      coupon: { type: "percent", value: 20 },
    });
    // subtotal 22800, 20% = 4560 discount
    expect(totals).toEqual({ subtotalPaise: 22800, discountPaise: 4560, totalPaise: 18240 });
  });

  it("never returns a negative total", () => {
    const totals = computeOrderTotals({
      productPricePaise: 9900,
      coupon: { type: "flat", value: 999999 },
    });
    expect(totals.totalPaise).toBe(0);
    expect(totals.discountPaise).toBe(9900);
  });

  it("works with no bumps and no coupon", () => {
    expect(computeOrderTotals({ productPricePaise: 29700 })).toEqual({
      subtotalPaise: 29700,
      discountPaise: 0,
      totalPaise: 29700,
    });
  });

  it("rejects a non-integer bump price (guards against client-sent floats)", () => {
    expect(() =>
      computeOrderTotals({ productPricePaise: 9900, bumpPricesPaise: [99.99] })
    ).toThrow();
  });
});

describe("formatPaiseAsInr", () => {
  it("formats paise as an INR currency string", () => {
    expect(formatPaiseAsInr(19900)).toBe("₹199.00");
    expect(formatPaiseAsInr(0)).toBe("₹0.00");
  });
});
