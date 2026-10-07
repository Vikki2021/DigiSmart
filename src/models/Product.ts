import mongoose, { Schema, Types, type Document, type Model } from "mongoose";

export interface ProductFile {
  r2Key: string;
  label: string;
  sizeBytes: number;
}

export interface ProductFaqItem {
  question: string;
  answer: string;
}

export interface ProductSections {
  subHeadline: string;
  headline: string;
  whyBuy: string[];
  whatsInside: string[];
  samples?: string[];
  bonus?: string[];
  faq: ProductFaqItem[];
}

export interface ProductDoc extends Document {
  slug: string;
  title: string;
  subtitle?: string;
  pricePaise: number;
  compareAtPaise?: number;
  coverImageUrl?: string;
  sections: ProductSections;
  files: ProductFile[];
  bumpProductIds: Types.ObjectId[];
  isActive: boolean;
  seo?: { title?: string; description?: string };
  createdAt: Date;
  updatedAt: Date;
}

const faqItemSchemaDef = new Schema<ProductFaqItem>(
  {
    question: { type: String, required: true },
    answer: { type: String, required: true },
  },
  { _id: false }
);

const sectionsSchemaDef = new Schema<ProductSections>(
  {
    subHeadline: { type: String, required: true },
    headline: { type: String, required: true },
    whyBuy: { type: [String], required: true },
    whatsInside: { type: [String], required: true },
    samples: { type: [String] },
    bonus: { type: [String] },
    faq: { type: [faqItemSchemaDef], required: true },
  },
  { _id: false }
);

const fileSchemaDef = new Schema<ProductFile>(
  {
    r2Key: { type: String, required: true },
    label: { type: String, required: true },
    sizeBytes: { type: Number, required: true },
  },
  { _id: false }
);

const productSchema = new Schema<ProductDoc>(
  {
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    title: { type: String, required: true },
    subtitle: { type: String },
    pricePaise: { type: Number, required: true, min: 0 },
    compareAtPaise: { type: Number, min: 0 },
    coverImageUrl: { type: String },
    sections: { type: sectionsSchemaDef, required: true },
    files: { type: [fileSchemaDef], default: [] },
    bumpProductIds: { type: [Schema.Types.ObjectId], ref: "Product", default: [] },
    isActive: { type: Boolean, default: true },
    seo: {
      title: { type: String },
      description: { type: String },
    },
  },
  { timestamps: true }
);

productSchema.index({ isActive: 1 });

export const Product: Model<ProductDoc> =
  (mongoose.models.Product as Model<ProductDoc>) ?? mongoose.model<ProductDoc>("Product", productSchema);
