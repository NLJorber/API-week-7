import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Event from "@/models/event";

export async function PUT(req, { params }) {
  await connectDB();
  const { userId } = auth();
  if (!userId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const event = await Event.findOneAndUpdate(
    { _id: params.id, user: userId },
    body,
    { new: true }
  );
  if (!event) return NextResponse.json({ message: "Event not found" }, { status: 404 });
  return NextResponse.json(event);
}

export async function DELETE(_req, { params }) {
  await connectDB();
  const { userId } = auth();
  if (!userId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  const event = await Event.findOneAndDelete({ _id: params.id, user: userId });
  if (!event) return NextResponse.json({ message: "Event not found" }, { status: 404 });
  return NextResponse.json({ message: "Event deleted" });
}
