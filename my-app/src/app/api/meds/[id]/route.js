import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Med from "@/models/med";

export async function GET(_req, { params }) {
  await connectDB();
  const { userId } = auth();
  if (!userId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  const med = await Med.findOne({ _id: params.id, userId });
  if (!med) return NextResponse.json({ message: "Medication not found" }, { status: 404 });
  return NextResponse.json(med);
}

export async function PUT(req, { params }) {
  await connectDB();
  const { userId } = auth();
  if (!userId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const med = await Med.findOneAndUpdate(
    { _id: params.id, userId },
    body,
    { new: true }
  );
  if (!med) return NextResponse.json({ message: "Medication not found" }, { status: 404 });
  return NextResponse.json({ med });
}

export async function DELETE(_req, { params }) {
  await connectDB();
  const { userId } = auth();
  if (!userId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  const med = await Med.findOneAndDelete({ _id: params.id, userId });
  if (!med) return NextResponse.json({ message: "Medication not found" }, { status: 404 });
  return NextResponse.json({ message: "Medication has been deleted" });
}
