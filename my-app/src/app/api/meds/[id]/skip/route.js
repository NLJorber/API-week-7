import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Med from "@/models/med";

export async function POST(req, { params }) {
  await connectDB();
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  const { reason } = await req.json();
  const med = await Med.findOne({ _id: params.id, userId });
  if (!med) return NextResponse.json({ message: "Medication not found" }, { status: 404 });

  med.taken = false;
  med.lastSkippedAt = new Date();
  med.skipReason = reason;
  med.skippedCount = (med.skippedCount || 0) + 1;
  if (typeof med.quantity === "number" && med.quantity > 0) {
    med.quantity = med.quantity - 1;
  }
  await med.save();
  return NextResponse.json({ message: "Dose marked as skipped and inventory updated", med });
}
