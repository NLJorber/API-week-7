import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { requireUserIdFromRequest } from "@/lib/request-auth";
import { jsonError } from "@/lib/route-utils";
import Med from "@/models/Med";

export async function GET(req, { params }) {
  try {
    const userId = requireUserIdFromRequest(req);
    await dbConnect();
    const med = await Med.findOne({ _id: params.id, userId });
    if (!med) {
      return NextResponse.json({ message: "Medication not found" }, { status: 404 });
    }
    return NextResponse.json(med);
  } catch (error) {
    return jsonError(error);
  }
}

export async function PUT(req, { params }) {
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
      quantity,
      lowStockThreshold
    } = body;

    await dbConnect();
    const updatedMed = await Med.findOneAndUpdate(
      { _id: params.id, userId },
      {
        name,
        dosage,
        dosageAmount,
        dosageUnit,
        timeToTake,
        frequency,
        notes,
        quantity,
        lowStockThreshold
      },
      { new: true }
    );

    if (!updatedMed) {
      return NextResponse.json({ message: "Medication not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Medication updated successfully", med: updatedMed });
  } catch (error) {
    return jsonError(error);
  }
}

export async function DELETE(req, { params }) {
  try {
    const userId = requireUserIdFromRequest(req);
    await dbConnect();
    const med = await Med.findOneAndDelete({ _id: params.id, userId });
    if (!med) {
      return NextResponse.json({ message: "Medication not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Medication has been deleted" });
  } catch (error) {
    return jsonError(error);
  }
}
