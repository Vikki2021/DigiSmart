import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";

export const metadata: Metadata = { title: "Terms of Service" };

export default function TermsPage() {
  return (
    <LegalPage title="Terms of Service" updatedAt="7 October 2026">
      <p>
        These Terms of Service govern your purchase and use of digital products sold by
        [BUSINESS NAME] ([ADDRESS]) through this website. By purchasing a product, you agree to
        these terms.
      </p>

      <h2 className="text-lg font-semibold text-black dark:text-zinc-50">1. Products</h2>
      <p>
        Our products are digital files (ebooks, PDFs, and similar materials) delivered
        electronically. No physical goods are shipped.
      </p>

      <h2 className="text-lg font-semibold text-black dark:text-zinc-50">2. License</h2>
      <p>
        When you buy a product, you receive a personal, non-transferable license to use it for
        your own purposes. You may not resell, redistribute, or share purchased files with people
        who have not paid for them.
      </p>

      <h2 className="text-lg font-semibold text-black dark:text-zinc-50">3. Pricing and payment</h2>
      <p>
        All prices are listed in Indian Rupees (INR) and include applicable taxes unless stated
        otherwise. Payments are processed securely via Razorpay; we do not store your card or UPI
        details.
      </p>

      <h2 className="text-lg font-semibold text-black dark:text-zinc-50">4. Refunds</h2>
      <p>
        Refunds are handled under our <a href="/refund-policy">Refund Policy</a>.
      </p>

      <h2 className="text-lg font-semibold text-black dark:text-zinc-50">5. Limitation of liability</h2>
      <p>
        Our products are provided &ldquo;as is&rdquo; for informational and educational purposes.
        We are not liable for any outcomes resulting from your use of the content.
      </p>

      <h2 className="text-lg font-semibold text-black dark:text-zinc-50">6. Changes to these terms</h2>
      <p>We may update these terms from time to time. Continued use of the site means you accept the current version.</p>

      <h2 className="text-lg font-semibold text-black dark:text-zinc-50">7. Governing law</h2>
      <p>These terms are governed by the laws of India.</p>

      <h2 className="text-lg font-semibold text-black dark:text-zinc-50">8. Contact</h2>
      <p>
        Questions about these terms? Email us at [EMAIL].
      </p>
    </LegalPage>
  );
}
