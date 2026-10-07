import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { Order } from "@/models/Order";
import { verifyPaymentInputSchema } from "@/lib/schemas/checkout";
import { verifyCheckoutSignature } from "@/lib/razorpay";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";

// UX-only verification for the Checkout.js success handler. This confirms
// the three fields are internally consistent so we can show a thank-you
// page immediately - it never marks the order paid and never triggers
// fulfilment (sending files, Meta Purchase event). Only the Razorpay
// webhook (Phase 5) does that, since only the webhook is proof the payment
// was actually captured.
export async function POST(req: NextRequest) {
  const ip = getClientIp(req.headers);
  const allowed = await checkRateLimit("checkout-verify", ip);
  if (!allowed) {
    return NextResponse.json({ ok: false }, { status: 429 });
  }

  const json = await req.json().catch(() => null);
  const parsed = verifyPaymentInputSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = parsed.data;

  const isValid = verifyCheckoutSignature({
    orderId: razorpay_order_id,
    paymentId: razorpay_payment_id,
    signature: razorpay_signature,
  });

  if (!isValid) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  await connectToDatabase();
  const order = await Order.findOne({ razorpayOrderId: razorpay_order_id }).select("_id").lean();
  if (!order) {
    return NextResponse.json({ ok: false }, { status: 404 });
  }

  return NextResponse.json({ ok: true, orderId: order._id.toString() });
}
