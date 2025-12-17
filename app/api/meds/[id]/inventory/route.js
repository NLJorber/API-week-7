import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { requireUserIdFromRequest } from "@/lib/request-auth";
import { jsonError } from "@/lib/route-utils";
import Med from "@/models/Med";

export async function PATCH(req, { params }) {
  try {
    const userId = requireUserIdFromRequest(req);
    const { amount } = await req.json();
    if (typeof amount !== "number") {
      return NextResponse.json({ message: "amount must be a number" }, { status: 400 });
    }

    await dbConnect();
    const med = await Med.findOne({ _id: params.id, userId });
    if (!med) {
      return NextResponse.json({ message: "Medication not found" }, { status: 404 });
    }

    med.quantity += amount;
    await med.save();

    return NextResponse.json({
      message: "Inventory updated",
      quantity: med.quantity,
      lowStock: med.quantity <= med.lowStockThreshold
    });
  } catch (error) {
    return jsonError(error);
  }
}
