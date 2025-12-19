import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Profile from "@/models/profile";

export async function GET() {
  await connectDB();
  const { userId } = auth();
  if (!userId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  const profiles = await Profile.find({ userId });
  return NextResponse.json(profiles);
}

export async function POST(req) {
  await connectDB();
  const { userId } = auth();
  if (!userId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const profile = await Profile.create({ ...body, userId });
  return NextResponse.json(profile, { status: 201 });
}
