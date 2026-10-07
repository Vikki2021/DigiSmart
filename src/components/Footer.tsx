import Link from "next/link";
import { getBrandName } from "@/lib/env";

const legalLinks = [
  { href: "/terms", label: "Terms" },
  { href: "/privacy", label: "Privacy" },
  { href: "/refund-policy", label: "Refunds" },
  { href: "/delivery-policy", label: "Delivery" },
  { href: "/contact", label: "Contact" },
];

export function Footer() {
  const brandName = getBrandName();
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-zinc-200 dark:border-zinc-800">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-4 px-4 py-8 text-sm text-zinc-600 dark:text-zinc-400 sm:flex-row sm:justify-between">
        <p>
          © {year} {brandName}. All rights reserved.
        </p>
        <nav className="flex flex-wrap items-center gap-4">
          {legalLinks.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-black dark:hover:text-zinc-50">
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
