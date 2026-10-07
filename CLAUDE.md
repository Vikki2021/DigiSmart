# Digital Store — project rules

## What this is
Own e-commerce store for Indian digital products (ebooks/PDFs). Buyers pay via Razorpay, get secure download access by email. Admin (single owner) manages products, orders, coupons. Meta Pixel + Conversions API for ad attribution. Brand name comes from env BRAND_NAME (default "SmartAiGuides").

## Owner context
Owner is a MERN developer, new to payments, security and Claude Code. Explain non-obvious decisions in 2-4 lines. Do not over-explain basics of React/Node. Prefer small, reviewable diffs.

## Stack
Next.js 16 (App Router, TypeScript strict, no `any`), Tailwind, MongoDB Atlas + Mongoose, Zod, Razorpay, Cloudflare R2 (S3 SDK), Resend, Upstash Ratelimit, Vitest.

## Commands
- dev: npm run dev
- build: npm run build   (must pass before every commit)
- test: npm test
- lint: npm run lint
- seed: npm run seed

## Non-negotiable rules
1. Money is INTEGER PAISE everywhere (DB, code, Razorpay). Never floats. Format to INR only in UI.
2. The server computes every price. The client may send only productId, bump IDs, coupon code. Never trust a client price.
3. Fulfilment (marking paid, sending files, Meta Purchase event) happens ONLY from the verified Razorpay webhook (payment.captured / order.paid). The browser callback only shows UI; it may verify the signature for UX but never fulfils.
4. Webhook: read the RAW body with `await req.text()`, verify HMAC-SHA256 (header x-razorpay-signature, key RAZORPAY_WEBHOOK_SECRET) with timingSafeEqual BEFORE JSON.parse. Store event id; process each event exactly once (idempotent).
5. Files live in a PRIVATE R2 bucket. Never expose a permanent URL. Only short-lived presigned URLs (<= 10 min) generated after token check.
6. Secrets only in env vars. `.env.local` is gitignored. Never log secrets, full tokens, or full PII.
7. Every API route/server action: Zod-validate input, rate-limit public routes, return generic errors to clients.
8. No fake reviews, fake counters, fake scarcity timers, or income guarantees anywhere in UI copy. Reviews render only from real admin-approved records.
9. Meta events: Pixel and CAPI use the SAME event_id (`order_<orderId>`). Hash email/phone with SHA-256 after normalising (trim+lowercase email; phone E.164). Do NOT hash fbp, fbc, IP, user agent. event_time in seconds.
10. Timezone display: Asia/Kolkata. Store UTC.

## Conventions
- /src/app (routes), /src/lib (db, razorpay, r2, email, meta, pricing, auth), /src/models, /src/components, /src/emails, /scripts (seed).
- Every phase ends: build passes, tests pass, summary of what changed, suggested commit message.
- If unsure about a Razorpay, Meta, or Next.js 16 API, check the official docs first; do not guess from memory.
