// Upserts the V1 catalog from the build playbook. Prices and copy here are
// placeholders — edit via the admin panel once it exists (Phase 8), or edit
// this file and re-run `npm run seed` until then.
import { config } from "dotenv";
config({ path: ".env.local" });

import { connectToDatabase } from "../src/lib/db";
import { Product, type ProductDoc } from "../src/models/Product";
import { productCoreSchema, type ProductCoreInput } from "../src/lib/schemas/product";

interface SeedProduct extends ProductCoreInput {
  bumpSlugs?: string[];
}

const products: SeedProduct[] = [
  {
    slug: "claude-prompts-for-teachers-bump",
    title: "500 Claude AI Prompts for Indian Teachers",
    pricePaise: 9900,
    isActive: true,
    files: [{ r2Key: "products/claude-prompts-for-teachers-bump/prompts.pdf", label: "Prompt pack (PDF)", sizeBytes: 500000 }],
    sections: {
      subHeadline: "500 ready-to-use prompts, organised by subject and grade",
      headline: "500 Claude AI Prompts for Indian Teachers",
      whyBuy: [
        "Skip the trial-and-error of writing prompts from scratch",
        "Covers lesson plans, worksheets, assessments and parent communication",
      ],
      whatsInside: ["500 prompts across 12 categories", "Copy-paste format, no editing needed"],
      faq: [
        { question: "Do I need a paid Claude subscription?", answer: "No, these prompts work with the free tier too." },
      ],
    },
  },
  {
    slug: "job-search-prompts-bump",
    title: "100 AI Prompts for Your Job Search (Copy-Paste Edition)",
    pricePaise: 7900,
    isActive: true,
    files: [{ r2Key: "products/job-search-prompts-bump/prompts.pdf", label: "Prompt pack (PDF)", sizeBytes: 400000 }],
    sections: {
      subHeadline: "Copy-paste prompts for resumes, cover letters and interview prep",
      headline: "100 AI Prompts for Your Job Search",
      whyBuy: ["Stop staring at a blank resume draft", "Built around what Indian recruiters actually screen for"],
      whatsInside: ["100 prompts across resume, outreach, and interview prep", "Works with any AI chatbot"],
      faq: [{ question: "Is this India-specific?", answer: "Yes, examples and tone are written for the Indian job market." }],
    },
  },
  {
    slug: "salary-negotiation-playbook-bump",
    // Price is TBD in the playbook (range ₹49-99) — picked the midpoint as a placeholder.
    title: "The Salary Negotiation Playbook",
    pricePaise: 7900,
    isActive: true,
    files: [{ r2Key: "products/salary-negotiation-playbook-bump/playbook.pdf", label: "Playbook (PDF)", sizeBytes: 300000 }],
    sections: {
      subHeadline: "Scripts and tactics for negotiating your next offer",
      headline: "The Salary Negotiation Playbook",
      whyBuy: ["Most candidates leave money on the table by not negotiating", "Word-for-word scripts, not vague advice"],
      whatsInside: ["Email and call scripts for common scenarios", "What to say when they say the budget is fixed"],
      faq: [{ question: "Does this work for fresher roles too?", answer: "Yes, with scripts adjusted for lower negotiating leverage." }],
    },
  },
  {
    slug: "master-claude-ai-2026",
    title: "Master Claude AI 2026",
    pricePaise: 19900,
    isActive: true,
    files: [{ r2Key: "products/master-claude-ai-2026/guide.pdf", label: "Guide (PDF)", sizeBytes: 2000000 }],
    sections: {
      subHeadline: "A practical guide to getting real work done with Claude",
      headline: "Master Claude AI 2026",
      whyBuy: [
        "Most guides explain features; this one explains workflows",
        "Written for people using Claude for actual daily work, not demos",
      ],
      whatsInside: [
        "Setting up Projects and Artifacts for recurring work",
        "Prompting patterns that hold up across long conversations",
        "Common mistakes that waste context and how to avoid them",
      ],
      faq: [
        { question: "Is this for beginners or advanced users?", answer: "Starts with fundamentals, then moves into workflows for daily use." },
        { question: "Will this get outdated quickly?", answer: "We revise it as Claude's features change; check back for updates." },
      ],
    },
  },
  {
    slug: "master-claude-ai-for-teachers",
    title: "Master Claude AI for Teachers",
    pricePaise: 9900,
    isActive: true,
    files: [{ r2Key: "products/master-claude-ai-for-teachers/guide.pdf", label: "Guide (PDF)", sizeBytes: 1500000 }],
    bumpSlugs: ["claude-prompts-for-teachers-bump"],
    sections: {
      subHeadline: "Save hours every week on lesson prep and grading",
      headline: "Master Claude AI for Teachers",
      whyBuy: ["Written for Indian classroom contexts, not generic edtech advice", "No technical background needed"],
      whatsInside: [
        "Lesson planning and worksheet generation workflows",
        "Using Claude for differentiated instruction and feedback",
      ],
      faq: [{ question: "Does this cover specific subjects?", answer: "The workflows apply across subjects; examples span several." }],
    },
  },
  {
    slug: "ai-job-search-playbook",
    title: "The AI Job Search Playbook",
    pricePaise: 14900,
    isActive: true,
    files: [{ r2Key: "products/ai-job-search-playbook/playbook.pdf", label: "Playbook (PDF)", sizeBytes: 1800000 }],
    bumpSlugs: ["job-search-prompts-bump", "salary-negotiation-playbook-bump"],
    sections: {
      subHeadline: "A step-by-step system for landing interviews faster",
      headline: "The AI Job Search Playbook",
      whyBuy: ["Built around what actually gets resumes past screening", "Covers the full funnel: resume, outreach, interviews"],
      whatsInside: [
        "Resume and LinkedIn optimization workflow",
        "Outreach templates that get replies",
        "Interview prep structured by role type",
      ],
      faq: [{ question: "Is this for a specific industry?", answer: "The system is industry-agnostic; examples skew tech and corporate roles." }],
    },
  },
  {
    slug: "punjabi-wedding-checklist",
    title: "The Punjabi Wedding Checklist",
    pricePaise: 29700,
    isActive: true,
    files: [{ r2Key: "products/punjabi-wedding-checklist/checklist.pdf", label: "Checklist (PDF)", sizeBytes: 1000000 }],
    sections: {
      subHeadline: "Everything to plan, in order, from engagement to reception",
      headline: "The Punjabi Wedding Checklist",
      whyBuy: ["Covers rituals and logistics most planning templates miss", "Built from real Punjabi wedding timelines, not generic wedding advice"],
      whatsInside: [
        "Month-by-month planning timeline",
        "Vendor checklist with questions to ask each one",
        "Day-of-event schedule template",
      ],
      faq: [{ question: "Does this cover both the groom's and bride's side events?", answer: "Yes, both sides' rituals and logistics are covered." }],
    },
  },
  {
    // Title and price are TBD per the owner — kept inactive so it never shows
    // on the storefront until the real content and price are filled in.
    slug: "diabetes-ebook-placeholder",
    title: "Diabetes Ebook (TBD — replace title and price before activating)",
    pricePaise: 19900,
    isActive: false,
    files: [],
    sections: {
      subHeadline: "TBD",
      headline: "TBD",
      whyBuy: ["TBD — replace with real content before activating"],
      whatsInside: ["TBD — replace with real content before activating"],
      faq: [{ question: "TBD", answer: "TBD" }],
    },
  },
];

async function main() {
  await connectToDatabase();

  const slugToId = new Map<string, ProductDoc["_id"]>();

  for (const product of products) {
    // productCoreSchema has no bumpSlugs field, so zod strips it from the parsed output.
    const parsed = productCoreSchema.parse(product);
    const doc = await Product.findOneAndUpdate(
      { slug: parsed.slug },
      { $set: parsed },
      { upsert: true, new: true }
    );
    slugToId.set(parsed.slug, doc._id);
    console.log(`Upserted ${parsed.slug}`);
  }

  for (const { slug, bumpSlugs } of products) {
    if (!bumpSlugs?.length) continue;
    const bumpProductIds = bumpSlugs.map((bumpSlug) => {
      const id = slugToId.get(bumpSlug);
      if (!id) throw new Error(`Unknown bump slug "${bumpSlug}" referenced by "${slug}"`);
      return id;
    });
    await Product.updateOne({ slug }, { $set: { bumpProductIds } });
    console.log(`Linked bumps for ${slug}: ${bumpSlugs.join(", ")}`);
  }

  console.log(`Seed complete: ${products.length} products upserted.`);
  process.exit(0);
}

main().catch((error) => {
  console.error("Seed failed:", error);
  process.exit(1);
});
