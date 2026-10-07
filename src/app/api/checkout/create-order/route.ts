import { NextRequest, NextResponse } from "next/server";
import { Types } from "mongoose";
import { connectToDatabase } from "@/lib/db";
import { Product } from "@/models/Product";
import { Coupon } from "@/models/Coupon";
import { Customer } from "@/models/Customer";
import { Order } from "@/models/Order";
import { createOrderInputSchema } from "@/lib/schemas/checkout";
import { resolveBumpSelection, validateCoupon } from "@/lib/checkout";
import { computeOrderTotals } from "@/lib/pricing";
import { createRazorpayOrder, getRazorpayKeyId } from "@/lib/razorpay";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";

// Razorpay rejects orders below 100 paise (₹1).
const MIN_ORDER_PAISE = 100;

export async function POST(req: NextRequest) {
  const ip = getClientIp(req.headers);
  const allowed = await checkRateLimit("checkout-create-order", ip);
  if (!allowed) {
    return NextResponse.json({ error: "Too many requests, try again shortly." }, { status: 429 });
  }

  const json = await req.json().catch(() => null);
  const parsed = createOrderInputSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }
  const input = parsed.data;

  await connectToDatabase();

  const product = await Product.findOne({ slug: input.productSlug, isActive: true }).lean();
  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  const allowedBumpIds = (product.bumpProductIds ?? []).map(String);
  const selectedBumpIds = resolveBumpSelection(allowedBumpIds, input.bumpProductIds);
  const bumpProducts = selectedBumpIds.length
    ? await Product.find({ _id: { $in: selectedBumpIds }, isActive: true }).lean()
    : [];

  let couponApplied = false;
  let couponForPricing = null;
  if (input.couponCode) {
    const couponDoc = await Coupon.findOne({ code: input.couponCode.toUpperCase() }).lean();
    const resolved = validateCoupon(
      couponDoc
        ? {
            type: couponDoc.type,
            value: couponDoc.value,
            isActive: couponDoc.isActive,
            expiresAt: couponDoc.expiresAt,
            maxUses: couponDoc.maxUses,
            usedCount: couponDoc.usedCount,
            productIds: couponDoc.productIds?.map(String),
          }
        : null,
      String(product._id)
    );
    if (resolved) {
      couponForPricing = resolved;
      couponApplied = true;
    }
  }

  const totals = computeOrderTotals({
    productPricePaise: product.pricePaise,
    bumpPricesPaise: bumpProducts.map((p) => p.pricePaise),
    coupon: couponForPricing,
  });

  if (totals.totalPaise < MIN_ORDER_PAISE) {
    return NextResponse.json({ error: "Order total is too low to process." }, { status: 400 });
  }

  const customer = await Customer.findOneAndUpdate(
    { email: input.customer.email },
    { $set: { name: input.customer.name, phone: input.customer.phone } },
    { upsert: true, new: true }
  );

  const razorpayOrder = await createRazorpayOrder({
    amountPaise: totals.totalPaise,
    receipt: `rcpt_${Date.now()}_${new Types.ObjectId().toString().slice(-8)}`,
    notes: { productSlug: product.slug },
  });

  const fbp = req.cookies.get("_fbp")?.value;
  const fbc = req.cookies.get("_fbc")?.value;
  const userAgent = req.headers.get("user-agent") ?? undefined;

  const order = await Order.create({
    customerId: customer._id,
    razorpayOrderId: razorpayOrder.id,
    items: [
      { productId: product._id, pricePaise: product.pricePaise, isBump: false },
      ...bumpProducts.map((p) => ({ productId: p._id, pricePaise: p.pricePaise, isBump: true })),
    ],
    subtotalPaise: totals.subtotalPaise,
    discountPaise: totals.discountPaise,
    totalPaise: totals.totalPaise,
    status: "created",
    couponCode: couponApplied ? input.couponCode?.toUpperCase() : undefined,
    utm: input.utm,
    fbp,
    fbc,
    ip,
    userAgent,
  });

  return NextResponse.json({
    orderId: order._id.toString(),
    razorpayOrderId: razorpayOrder.id,
    amountPaise: totals.totalPaise,
    keyId: getRazorpayKeyId(),
    couponApplied,
  });
}
