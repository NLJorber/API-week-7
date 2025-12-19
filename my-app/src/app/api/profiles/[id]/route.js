import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Profile from "@/models/profile";

export async function GET(_req, { params }) {
  await connectDB();
  const { userId } = auth();
  if (!userId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  const profile = await Profile.findOne({ _id: params.id, userId });
  if (!profile) return NextResponse.json({ message: "Profile not found" }, { status: 404 });
  return NextResponse.json(profile);
}

export async function PUT(req, { params }) {
  await connectDB();
  const { userId } = auth();
  if (!userId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const profile = await Profile.findOneAndUpdate({ _id: params.id, userId }, body, { new: true });
  if (!profile) return NextResponse.json({ message: "Profile not found" }, { status: 404 });
  return NextResponse.json(profile);
}

export async function DELETE(_req, { params }) {
  await connectDB();
  const { userId } = auth();
  if (!userId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  const profile = await Profile.findOneAndDelete({ _id: params.id, userId });
  if (!profile) return NextResponse.json({ message: "Profile not found" }, { status: 404 });
  return NextResponse.json({ message: "Profile deleted" });
}
