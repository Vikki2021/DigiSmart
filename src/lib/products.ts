import { Types } from "mongoose";
import { connectToDatabase } from "./db";
import { Product, type ProductFile, type ProductSections } from "@/models/Product";

export interface PlainProduct {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  pricePaise: number;
  compareAtPaise?: number;
  coverImageUrl?: string;
  sections: ProductSections;
  files: ProductFile[];
  isActive: boolean;
  seo?: { title?: string; description?: string };
}

interface ProductLeanDoc {
  _id: Types.ObjectId;
  slug: string;
  title: string;
  subtitle?: string;
  pricePaise: number;
  compareAtPaise?: number;
  coverImageUrl?: string;
  sections: ProductSections;
  files: ProductFile[];
  isActive: boolean;
  seo?: { title?: string; description?: string };
}

function toPlainProduct(doc: ProductLeanDoc): PlainProduct {
  return {
    id: doc._id.toString(),
    slug: doc.slug,
    title: doc.title,
    subtitle: doc.subtitle,
    pricePaise: doc.pricePaise,
    compareAtPaise: doc.compareAtPaise,
    coverImageUrl: doc.coverImageUrl,
    sections: doc.sections,
    files: doc.files,
    isActive: doc.isActive,
    seo: doc.seo,
  };
}

export async function getActiveProducts(): Promise<PlainProduct[]> {
  await connectToDatabase();
  const docs = (await Product.find({ isActive: true })
    .sort({ createdAt: 1 })
    .lean()) as unknown as ProductLeanDoc[];
  return docs.map(toPlainProduct);
}

export async function getProductBySlug(slug: string): Promise<PlainProduct | null> {
  await connectToDatabase();
  const doc = (await Product.findOne({ slug, isActive: true }).lean()) as unknown as ProductLeanDoc | null;
  return doc ? toPlainProduct(doc) : null;
}
