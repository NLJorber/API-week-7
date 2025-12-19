import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Event from "@/models/event";

export async function GET() {
  await connectDB();
  const { userId } = auth();
  if (!userId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  const events = await Event.find({ user: userId }).populate("medication");
  return NextResponse.json(events);
}

export async function POST(req) {
  await connectDB();
  const { userId } = auth();
  if (!userId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const event = await Event.create({ ...body, user: userId });
  return NextResponse.json(event, { status: 201 });
}
