import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Med from "@/models/med";

export async function GET() {
  await connectDB();
  const { userId } = auth();
  console.log("API /api/meds GET userId", userId);
  if (!userId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  const meds = await Med.find({ userId });
  return NextResponse.json(meds);
}

export async function POST(req) {
  await connectDB();
  const { userId } = auth();
  console.log("API /api/meds POST userId", userId, "cookie:", req.headers.get("cookie"));
  if (!userId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const med = await Med.create({ ...body, userId });
  return NextResponse.json({ med }, { status: 201 });
}
