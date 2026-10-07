import mongoose, { Schema, type Document, type Model } from "mongoose";

export interface WebhookEventDoc extends Document {
  razorpayEventId: string;
  type: string;
  payloadHash: string;
  processedAt: Date;
}

const webhookEventSchema = new Schema<WebhookEventDoc>({
  razorpayEventId: { type: String, required: true, unique: true },
  type: { type: String, required: true },
  payloadHash: { type: String, required: true },
  processedAt: { type: Date, default: () => new Date() },
});

export const WebhookEvent: Model<WebhookEventDoc> =
  (mongoose.models.WebhookEvent as Model<WebhookEventDoc>) ??
  mongoose.model<WebhookEventDoc>("WebhookEvent", webhookEventSchema);
