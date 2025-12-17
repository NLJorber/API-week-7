import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { requireUserIdFromRequest } from "@/lib/request-auth";
import { jsonError } from "@/lib/route-utils";
import Med from "@/models/Med";

export async function POST(req, { params }) {
  try {
    const userId = requireUserIdFromRequest(req);
    const { reason } = (await req.json()) || {};
    await dbConnect();
    const med = await Med.findOne({ _id: params.id, userId });
    if (!med) {
      return NextResponse.json({ message: "Medication not found" }, { status: 404 });
    }

    med.taken = false;
    med.lastSkippedAt = new Date();
    med.skipReason = reason;
    med.skippedCount = (med.skippedCount || 0) + 1;
    if (typeof med.quantity === "number" && med.quantity > 0) {
      med.quantity = med.quantity - 1;
    }

    await med.save();
    return NextResponse.json({ message: "Dose marked as skipped and inventory updated", med });
  } catch (error) {
    return jsonError(error);
  }
}
