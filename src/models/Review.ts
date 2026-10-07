import mongoose, { Schema, Types, type Document, type Model } from "mongoose";

export interface ReviewDoc extends Document {
  productId: Types.ObjectId;
  name: string;
  rating: number;
  text: string;
  isApproved: boolean;
  source?: string;
  createdAt: Date;
  updatedAt: Date;
}

const reviewSchema = new Schema<ReviewDoc>(
  {
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    name: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    text: { type: String, required: true },
    isApproved: { type: Boolean, default: false },
    source: { type: String },
  },
  { timestamps: true }
);

reviewSchema.index({ productId: 1, isApproved: 1 });

export const Review: Model<ReviewDoc> =
  (mongoose.models.Review as Model<ReviewDoc>) ?? mongoose.model<ReviewDoc>("Review", reviewSchema);
