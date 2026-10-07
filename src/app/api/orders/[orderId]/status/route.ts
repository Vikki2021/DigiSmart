import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/db";
import { Order } from "@/models/Order";

// Deliberately returns only `status`, nothing else - no customer info, no
// amounts, no items. The order id itself (a Mongo ObjectId) is the only
// thing gating this, which is fine for a status poll but not proof of
// identity, so it must never leak anything beyond this one field.
export async function GET(_req: Request, context: RouteContext<"/api/orders/[orderId]/status">) {
  const { orderId } = await context.params;

  if (!mongoose.isValidObjectId(orderId)) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await connectToDatabase();
  const order = await Order.findById(orderId).select("status").lean();
  if (!order) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ status: order.status });
}
