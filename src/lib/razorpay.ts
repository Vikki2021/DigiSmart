import crypto from "node:crypto";
import Razorpay from "razorpay";

function getKeys(): { keyId: string; keySecret: string } {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) {
    throw new Error("RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET are not set");
  }
  return { keyId, keySecret };
}

export function getRazorpayKeyId(): string {
  return getKeys().keyId;
}

export async function createRazorpayOrder(params: {
  amountPaise: number;
  receipt: string;
  notes?: Record<string, string>;
}): Promise<{ id: string; amount: number; currency: string }> {
  const { keyId, keySecret } = getKeys();
  const client = new Razorpay({ key_id: keyId, key_secret: keySecret });

  const order = await client.orders.create({
    amount: params.amountPaise,
    currency: "INR",
    receipt: params.receipt,
    notes: params.notes,
  });

  return { id: order.id, amount: Number(order.amount), currency: order.currency };
}

/**
 * Verifies the Checkout.js success-handler payload (order id, payment id,
 * signature). This is for UX only - it tells the browser "looks genuine, you
 * can show a thank-you page" - it never marks an order paid or triggers
 * fulfilment. Only the webhook (Phase 5) does that, since this endpoint has
 * no way to confirm the payment was actually captured, only that the
 * three values are internally consistent.
 */
export function verifyCheckoutSignature(params: {
  orderId: string;
  paymentId: string;
  signature: string;
}): boolean {
  const { keySecret } = getKeys();
  const expected = crypto
    .createHmac("sha256", keySecret)
    .update(`${params.orderId}|${params.paymentId}`)
    .digest("hex");

  const expectedBuf = Buffer.from(expected, "hex");
  const actualBuf = Buffer.from(params.signature, "hex");
  if (expectedBuf.length !== actualBuf.length) {
    return false;
  }
  return crypto.timingSafeEqual(expectedBuf, actualBuf);
}
