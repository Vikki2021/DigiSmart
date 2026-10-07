import mongoose, { Schema, Types, type Document, type Model } from "mongoose";

export type CouponType = "percent" | "flat";

export interface CouponDoc extends Document {
  code: string;
  type: CouponType;
  value: number;
  maxUses?: number;
  usedCount: number;
  expiresAt?: Date;
  productIds?: Types.ObjectId[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const couponSchema = new Schema<CouponDoc>(
  {
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    type: { type: String, enum: ["percent", "flat"], required: true },
    value: { type: Number, required: true, min: 1 },
    maxUses: { type: Number, min: 1 },
    usedCount: { type: Number, default: 0, min: 0 },
    expiresAt: { type: Date },
    productIds: { type: [Schema.Types.ObjectId], ref: "Product" },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

couponSchema.index({ isActive: 1 });

export const Coupon: Model<CouponDoc> =
  (mongoose.models.Coupon as Model<CouponDoc>) ?? mongoose.model<CouponDoc>("Coupon", couponSchema);
