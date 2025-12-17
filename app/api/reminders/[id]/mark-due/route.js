import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { requireUserIdFromRequest } from "@/lib/request-auth";
import { jsonError } from "@/lib/route-utils";
import Reminder from "@/models/Reminder";

export async function POST(req, { params }) {
  try {
    const userId = requireUserIdFromRequest(req);
    await dbConnect();
    const reminder = await Reminder.findOneAndUpdate(
      { _id: params.id, userId },
      { status: "due" },
      { new: true }
    );

    if (!reminder) {
      return NextResponse.json({ message: "Reminder not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Reminder marked as due", reminder });
  } catch (error) {
    return jsonError(error);
  }
}
