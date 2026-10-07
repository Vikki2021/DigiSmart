import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";

export const metadata: Metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy" updatedAt="7 October 2026">
      <p>
        This Privacy Policy explains what personal data [BUSINESS NAME] ([ADDRESS]) collects when
        you buy from this website, why we collect it, and how you can request access to or
        deletion of your data, in line with India&rsquo;s Digital Personal Data Protection Act.
      </p>

      <h2 className="text-lg font-semibold text-black dark:text-zinc-50">What we collect</h2>
      <ul className="list-disc space-y-1 pl-5">
        <li>Name, email address, and phone number you provide at checkout</li>
        <li>Payment confirmation details from Razorpay (we never see or store your card/UPI details)</li>
        <li>Order history and the files you&rsquo;ve purchased</li>
        <li>Technical data like IP address and browser user agent, used for fraud prevention</li>
        <li>Advertising identifiers (via Meta Pixel) if you arrived from a Meta ad, used to measure ad performance</li>
      </ul>

      <h2 className="text-lg font-semibold text-black dark:text-zinc-50">Why we collect it</h2>
      <ul className="list-disc space-y-1 pl-5">
        <li>To process your order and deliver your purchased files</li>
        <li>To send order confirmations and support you if something goes wrong</li>
        <li>To prevent fraud and abuse of download links</li>
        <li>To measure and improve our advertising</li>
      </ul>

      <h2 className="text-lg font-semibold text-black dark:text-zinc-50">Who we share it with</h2>
      <p>
        We share the minimum data needed with: Razorpay (payments), Resend (sending order emails),
        Cloudflare (file storage), MongoDB Atlas (database hosting), and Meta (advertising
        measurement). We do not sell your data to anyone.
      </p>

      <h2 className="text-lg font-semibold text-black dark:text-zinc-50">How long we keep it</h2>
      <p>
        We retain order and customer records as long as needed for accounting, tax, and support
        purposes, and as required by Indian law.
      </p>

      <h2 className="text-lg font-semibold text-black dark:text-zinc-50">Your rights</h2>
      <p>
        You can request a copy of your data or ask us to delete it by emailing [EMAIL]. We will
        respond within a reasonable time, subject to our legal obligations to retain certain
        records (e.g. for tax purposes).
      </p>

      <h2 className="text-lg font-semibold text-black dark:text-zinc-50">Contact / Grievance Officer</h2>
      <p>For privacy questions or complaints, contact [EMAIL].</p>
    </LegalPage>
  );
}
