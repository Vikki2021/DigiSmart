import mongoose, { Schema, Types, type Document, type Model } from "mongoose";

export interface DownloadAccessFileItem {
  r2Key: string;
  label: string;
  downloadCount: number;
}

export interface DownloadAccessDoc extends Document {
  orderId: Types.ObjectId;
  tokenHash: string;
  items: DownloadAccessFileItem[];
  maxDownloadsPerFile: number;
  expiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const downloadItemSchemaDef = new Schema<DownloadAccessFileItem>(
  {
    r2Key: { type: String, required: true },
    label: { type: String, required: true },
    downloadCount: { type: Number, default: 0, min: 0 },
  },
  { _id: false }
);

const downloadAccessSchema = new Schema<DownloadAccessDoc>(
  {
    orderId: { type: Schema.Types.ObjectId, ref: "Order", required: true, unique: true },
    tokenHash: { type: String, required: true, unique: true },
    items: { type: [downloadItemSchemaDef], required: true },
    maxDownloadsPerFile: { type: Number, default: 10, min: 1 },
    expiresAt: { type: Date },
  },
  { timestamps: true }
);

export const DownloadAccess: Model<DownloadAccessDoc> =
  (mongoose.models.DownloadAccess as Model<DownloadAccessDoc>) ??
  mongoose.model<DownloadAccessDoc>("DownloadAccess", downloadAccessSchema);
