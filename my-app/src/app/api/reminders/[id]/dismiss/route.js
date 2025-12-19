import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Reminder from "@/models/reminder";

export async function POST(_req, { params }) {
  await connectDB();
  const { userId } = auth();
  if (!userId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  const reminder = await Reminder.findOneAndUpdate(
    { _id: params.id, userId },
    { status: "dismissed" },
    { new: true }
  );
  if (!reminder) return NextResponse.json({ message: "Reminder not found" }, { status: 404 });
  return NextResponse.json(reminder);
}
