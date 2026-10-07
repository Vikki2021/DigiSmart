import { Types } from "mongoose";
import { connectToDatabase } from "./db";
import { Review } from "@/models/Review";

export interface PlainReview {
  id: string;
  name: string;
  rating: number;
  text: string;
}

interface ReviewLeanDoc {
  _id: Types.ObjectId;
  name: string;
  rating: number;
  text: string;
}

// Only ever reads isApproved: true — admin-approved reviews are the only
// kind this store ever renders, per CLAUDE.md's no-fake-reviews rule.
export async function getApprovedReviews(productId: string): Promise<PlainReview[]> {
  await connectToDatabase();
  const docs = (await Review.find({ productId: new Types.ObjectId(productId), isApproved: true })
    .sort({ createdAt: -1 })
    .lean()) as unknown as ReviewLeanDoc[];
  return docs.map((doc) => ({
    id: doc._id.toString(),
    name: doc.name,
    rating: doc.rating,
    text: doc.text,
  }));
}
