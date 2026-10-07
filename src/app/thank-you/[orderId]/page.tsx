import { ThankYouStatus } from "@/components/ThankYouStatus";

export default async function ThankYouPage({ params }: PageProps<"/thank-you/[orderId]">) {
  const { orderId } = await params;

  return (
    <div className="mx-auto max-w-xl px-4 py-16 text-center">
      <h1 className="text-2xl font-semibold text-black dark:text-zinc-50">Thank you</h1>
      <div className="mt-4">
        <ThankYouStatus orderId={orderId} />
      </div>
    </div>
  );
}
