import { describe, expect, it } from "vitest";
import { createOrderInputSchema } from "./checkout";

describe("createOrderInputSchema", () => {
  const validInput = {
    productSlug: "master-claude-ai-2026",
    bumpProductIds: [],
    customer: { name: "Test Buyer", email: "buyer@example.com", phone: "9999999999" },
    consent: true,
  };

  it("accepts a well-formed request", () => {
    expect(createOrderInputSchema.safeParse(validInput).success).toBe(true);
  });

  it("strips a client-injected price field instead of trusting it (price tampering guard)", () => {
    const tampered = { ...validInput, pricePaise: 1, totalPaise: 1, amountPaise: 1 };
    const parsed = createOrderInputSchema.parse(tampered);
    expect(parsed).not.toHaveProperty("pricePaise");
    expect(parsed).not.toHaveProperty("totalPaise");
    expect(parsed).not.toHaveProperty("amountPaise");
  });

  it("rejects a request without explicit consent", () => {
    expect(createOrderInputSchema.safeParse({ ...validInput, consent: false }).success).toBe(false);
  });

  it("rejects a request missing consent entirely", () => {
    const withoutConsent: Partial<typeof validInput> = { ...validInput };
    delete withoutConsent.consent;
    expect(createOrderInputSchema.safeParse(withoutConsent).success).toBe(false);
  });

  it("rejects an invalid email", () => {
    const invalid = { ...validInput, customer: { ...validInput.customer, email: "not-an-email" } };
    expect(createOrderInputSchema.safeParse(invalid).success).toBe(false);
  });

  it("lowercases the email", () => {
    const mixedCase = { ...validInput, customer: { ...validInput.customer, email: "Buyer@Example.com" } };
    const parsed = createOrderInputSchema.parse(mixedCase);
    expect(parsed.customer.email).toBe("buyer@example.com");
  });
});
