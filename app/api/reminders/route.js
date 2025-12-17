import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { requireUserIdFromRequest } from "@/lib/request-auth";
import { jsonError } from "@/lib/route-utils";
import Reminder from "@/models/Reminder";

export async function GET(req) {
  try {
    const userId = requireUserIdFromRequest(req);
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const dueBefore = searchParams.get("dueBefore");
    const dueAfter = searchParams.get("dueAfter");

    const filter = { userId };
    if (status) filter.status = status;
    if (dueBefore) filter.dueAt = { ...(filter.dueAt || {}), $lte: new Date(dueBefore) };
    if (dueAfter) filter.dueAt = { ...(filter.dueAt || {}), $gte: new Date(dueAfter) };

    await dbConnect();
    const reminders = await Reminder.find(filter).sort({ dueAt: 1 });
    return NextResponse.json(reminders);
  } catch (error) {
    return jsonError(error);
  }
}

export async function POST(req) {
  try {
    const userId = requireUserIdFromRequest(req);
    const { medId, message, dueAt } = await req.json();
    if (!message || !dueAt) {
      return NextResponse.json({ message: "message and dueAt are required" }, { status: 400 });
    }

    await dbConnect();
    const reminder = await Reminder.create({
      userId,
      medId,
      message,
      dueAt,
      status: "pending"
    });
    return NextResponse.json(reminder);
  } catch (error) {
    return jsonError(error);
  }
}
