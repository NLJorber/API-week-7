import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { requireUserIdFromRequest } from "@/lib/request-auth";
import { jsonError } from "@/lib/route-utils";
import Med from "@/models/Med";

export async function POST(req, { params }) {
  try {
    const userId = requireUserIdFromRequest(req);
    await dbConnect();
    const med = await Med.findOne({ _id: params.id, userId });
    if (!med) {
      return NextResponse.json({ message: "Medication not found" }, { status: 404 });
    }

    med.lastTakenAt = new Date();
    med.taken = true;
    med.takenCount = (med.takenCount || 0) + 1;
    if (typeof med.quantity === "number" && med.quantity > 0) {
      med.quantity = med.quantity - 1;
    }

    await med.save();
    return NextResponse.json({ message: "Medication marked as taken and inventory updated", med });
  } catch (error) {
    return jsonError(error);
  }
}
