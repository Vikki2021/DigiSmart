import mongoose, { Schema, type Document, type Model } from "mongoose";

export interface CustomerDoc extends Document {
  email: string;
  name?: string;
  phone?: string;
  createdAt: Date;
  updatedAt: Date;
}

const customerSchema = new Schema<CustomerDoc>(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    name: { type: String },
    phone: { type: String },
  },
  { timestamps: true }
);

export const Customer: Model<CustomerDoc> =
  (mongoose.models.Customer as Model<CustomerDoc>) ?? mongoose.model<CustomerDoc>("Customer", customerSchema);
