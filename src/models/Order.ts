import mongoose, { Schema, Types, type Document, type Model } from "mongoose";

export type OrderStatus = "created" | "paid" | "fulfilled" | "failed" | "refunded";

export interface OrderItem {
  productId: Types.ObjectId;
  pricePaise: number;
  isBump: boolean;
}

export interface OrderDoc extends Document {
  customerId: Types.ObjectId;
  razorpayOrderId: string;
  razorpayPaymentId?: string;
  items: OrderItem[];
  subtotalPaise: number;
  discountPaise: number;
  totalPaise: number;
  status: OrderStatus;
  couponCode?: string;
  utm?: Record<string, string>;
  fbp?: string;
  fbc?: string;
  ip?: string;
  userAgent?: string;
  paidAt?: Date;
  fulfilledAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const orderItemSchemaDef = new Schema<OrderItem>(
  {
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    pricePaise: { type: Number, required: true, min: 0 },
    isBump: { type: Boolean, default: false },
  },
  { _id: false }
);

const orderSchema = new Schema<OrderDoc>(
  {
    customerId: { type: Schema.Types.ObjectId, ref: "Customer", required: true },
    razorpayOrderId: { type: String, required: true, unique: true },
    razorpayPaymentId: { type: String },
    items: { type: [orderItemSchemaDef], required: true },
    subtotalPaise: { type: Number, required: true, min: 0 },
    discountPaise: { type: Number, default: 0, min: 0 },
    totalPaise: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ["created", "paid", "fulfilled", "failed", "refunded"],
      default: "created",
    },
    couponCode: { type: String },
    utm: { type: Schema.Types.Mixed },
    fbp: { type: String },
    fbc: { type: String },
    ip: { type: String },
    userAgent: { type: String },
    paidAt: { type: Date },
    fulfilledAt: { type: Date },
  },
  { timestamps: true }
);

orderSchema.index({ status: 1 });
orderSchema.index({ customerId: 1 });

export const Order: Model<OrderDoc> =
  (mongoose.models.Order as Model<OrderDoc>) ?? mongoose.model<OrderDoc>("Order", orderSchema);
