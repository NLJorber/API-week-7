import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { requireUserIdFromRequest } from "@/lib/request-auth";
import { jsonError } from "@/lib/route-utils";
import Med from "@/models/Med";

export async function GET(req) {
  try {
    const userId = requireUserIdFromRequest(req);
    await dbConnect();
    const meds = await Med.find({ userId });
    return NextResponse.json(meds);
  } catch (error) {
    return jsonError(error);
  }
}

export async function POST(req) {
  try {
    const userId = requireUserIdFromRequest(req);
    const body = await req.json();
    const {
      name,
      dosage,
      dosageAmount,
      dosageUnit,
      timeToTake,
      frequency,
      notes,
      profileId,
      quantity
    } = body;

    await dbConnect();
    const med = await Med.create({
      userId,
      profileId,
      name,
      dosage,
      dosageAmount,
      dosageUnit,
      timeToTake,
      frequency,
      notes,
      quantity
    });

    return NextResponse.json({ message: "Medication created successfully", med });
  } catch (error) {
    return jsonError(error);
  }
}
