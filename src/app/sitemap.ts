import type { MetadataRoute } from "next";
import { getActiveProducts } from "@/lib/products";

export const dynamic = "force-dynamic";

const staticRoutes = ["", "/terms", "/privacy", "/refund-policy", "/delivery-policy", "/contact"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const products = await getActiveProducts();

  return [
    ...staticRoutes.map((path) => ({ url: `${siteUrl}${path}` })),
    ...products.map((product) => ({ url: `${siteUrl}/p/${product.slug}` })),
  ];
}
