import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Reminder from "@/models/reminder";

export async function GET() {
  await connectDB();
  const { userId } = auth();
  if (!userId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  const reminders = await Reminder.find({ userId });
  return NextResponse.json(reminders);
}

export async function POST(req) {
  await connectDB();
  const { userId } = auth();
  if (!userId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const reminder = await Reminder.create({ ...body, userId });
  return NextResponse.json(reminder, { status: 201 });
}
