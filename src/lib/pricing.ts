// All amounts here are integer paise. Never floats — Razorpay and the DB
// both deal in integer paise, so rounding happens once, at discount time.

export interface CouponInput {
  type: "percent" | "flat";
  value: number;
}

export interface OrderTotals {
  subtotalPaise: number;
  discountPaise: number;
  totalPaise: number;
}

function assertNonNegativeInteger(value: number, label: string): void {
  if (!Number.isInteger(value) || value < 0) {
    throw new Error(`${label} must be a non-negative integer (paise)`);
  }
}

/**
 * Discount is clamped to [0, subtotalPaise] so a misconfigured or huge flat
 * coupon can never push the total below zero.
 */
export function computeDiscountPaise(subtotalPaise: number, coupon: CouponInput | null): number {
  assertNonNegativeInteger(subtotalPaise, "subtotalPaise");
  if (!coupon || subtotalPaise === 0) {
    return 0;
  }

  const rawDiscount =
    coupon.type === "percent" ? Math.round((subtotalPaise * coupon.value) / 100) : coupon.value;

  return Math.min(Math.max(rawDiscount, 0), subtotalPaise);
}

export function computeOrderTotals(params: {
  productPricePaise: number;
  bumpPricesPaise?: number[];
  coupon?: CouponInput | null;
}): OrderTotals {
  const { productPricePaise, bumpPricesPaise = [], coupon = null } = params;

  assertNonNegativeInteger(productPricePaise, "productPricePaise");
  bumpPricesPaise.forEach((price, index) =>
    assertNonNegativeInteger(price, `bumpPricesPaise[${index}]`)
  );

  const subtotalPaise = productPricePaise + bumpPricesPaise.reduce((sum, price) => sum + price, 0);
  const discountPaise = computeDiscountPaise(subtotalPaise, coupon);
  const totalPaise = subtotalPaise - discountPaise;

  return { subtotalPaise, discountPaise, totalPaise };
}

export function formatPaiseAsInr(paise: number): string {
  assertNonNegativeInteger(paise, "paise");
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(paise / 100);
}
