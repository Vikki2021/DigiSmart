import crypto from "node:crypto";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { verifyCheckoutSignature } from "./razorpay";

const ORIGINAL_SECRET = process.env.RAZORPAY_KEY_SECRET;
const ORIGINAL_KEY_ID = process.env.RAZORPAY_KEY_ID;

function signaturesFor(orderId: string, paymentId: string, secret: string): string {
  return crypto.createHmac("sha256", secret).update(`${orderId}|${paymentId}`).digest("hex");
}

describe("verifyCheckoutSignature", () => {
  beforeEach(() => {
    process.env.RAZORPAY_KEY_SECRET = "test_secret_abc123";
    process.env.RAZORPAY_KEY_ID = "rzp_test_dummy";
  });

  afterEach(() => {
    process.env.RAZORPAY_KEY_SECRET = ORIGINAL_SECRET;
    process.env.RAZORPAY_KEY_ID = ORIGINAL_KEY_ID;
  });

  it("accepts a correctly computed signature", () => {
    const signature = signaturesFor("order_123", "pay_456", "test_secret_abc123");
    expect(
      verifyCheckoutSignature({ orderId: "order_123", paymentId: "pay_456", signature })
    ).toBe(true);
  });

  it("rejects a signature computed with the wrong secret", () => {
    const signature = signaturesFor("order_123", "pay_456", "wrong_secret");
    expect(
      verifyCheckoutSignature({ orderId: "order_123", paymentId: "pay_456", signature })
    ).toBe(false);
  });

  it("rejects a signature for a different order/payment pair (tampered)", () => {
    const signature = signaturesFor("order_123", "pay_456", "test_secret_abc123");
    expect(
      verifyCheckoutSignature({ orderId: "order_999", paymentId: "pay_456", signature })
    ).toBe(false);
  });

  it("rejects a malformed/short signature without throwing", () => {
    expect(
      verifyCheckoutSignature({ orderId: "order_123", paymentId: "pay_456", signature: "not-hex" })
    ).toBe(false);
  });

  it("rejects an empty signature", () => {
    expect(
      verifyCheckoutSignature({ orderId: "order_123", paymentId: "pay_456", signature: "" })
    ).toBe(false);
  });
});
