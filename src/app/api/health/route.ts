import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/db";

export async function GET() {
  try {
    await connectToDatabase();
    const pingOk = (await mongoose.connection.db?.admin().ping())?.ok === 1;
    return NextResponse.json({ ok: pingOk === true, db: "connected" });
  } catch (error) {
    return NextResponse.json(
      { ok: false, db: "unreachable", error: error instanceof Error ? error.message : "unknown" },
      { status: 503 }
    );
  }
}
