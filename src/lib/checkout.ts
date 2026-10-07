import type { CouponInput } from "./pricing";

/**
 * Drops any requested bump id that isn't actually one of this product's
 * configured bumps. The client can request anything; only ids present in
 * `allowedBumpIds` (loaded from the product doc) are honored - this is what
 * stops a tampered request from attaching an unrelated, differently priced
 * product as a "bump".
 */
export function resolveBumpSelection(allowedBumpIds: string[], requestedBumpIds: string[]): string[] {
  const allowed = new Set(allowedBumpIds);
  return [...new Set(requestedBumpIds)].filter((id) => allowed.has(id));
}

export interface CouponRecord {
  type: "percent" | "flat";
  value: number;
  isActive: boolean;
  expiresAt?: Date;
  maxUses?: number;
  usedCount: number;
  productIds?: string[];
}

/**
 * Returns the coupon as pricing input if it's actually usable for this
 * product right now, or null if it's missing/expired/exhausted/restricted
 * to other products. Invalid coupons are silently ignored (no discount)
 * rather than rejecting the whole checkout - the caller surfaces
 * `couponApplied: false` so the UI can tell the buyer it didn't apply.
 */
export function validateCoupon(
  coupon: CouponRecord | null,
  productId: string,
  now: Date = new Date()
): CouponInput | null {
  if (!coupon) return null;
  if (!coupon.isActive) return null;
  if (coupon.expiresAt && coupon.expiresAt.getTime() < now.getTime()) return null;
  if (coupon.maxUses !== undefined && coupon.usedCount >= coupon.maxUses) return null;
  if (coupon.productIds && coupon.productIds.length > 0 && !coupon.productIds.includes(productId)) {
    return null;
  }
  return { type: coupon.type, value: coupon.value };
}
