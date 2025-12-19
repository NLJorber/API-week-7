import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Med from "@/models/med";

export async function PATCH(req, { params }) {
  await connectDB();
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  const { amount } = await req.json();
  if (typeof amount !== "number") {
    return NextResponse.json({ message: "amount must be a number" }, { status: 400 });
  }
  const med = await Med.findOne({ _id: params.id, userId });
  if (!med) return NextResponse.json({ message: "Medication not found" }, { status: 404 });

  med.quantity += amount;
  await med.save();
  return NextResponse.json({
    message: "Inventory updated",
    quantity: med.quantity,
    lowStock: med.quantity <= med.lowStockThreshold
  });
}
