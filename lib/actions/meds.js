"use server";

import { revalidatePath } from "next/cache";
import dbConnect from "@/lib/db";
import { requireUserId } from "@/lib/auth";
import Med from "@/models/Med";

function parseNumber(value) {
  if (value === "" || value === null || value === undefined) return undefined;
  const parsed = Number(value);
  return Number.isNaN(parsed) ? undefined : parsed;
}

export async function createMedAction(prevState, formData) {
  const userId = requireUserId();
  const name = String(formData.get("name") || "").trim();
  const dosage = String(formData.get("dosage") || "").trim();
  const frequency = String(formData.get("frequency") || "").trim();
  const timeToTake = String(formData.get("timeToTake") || "").trim();
  const notes = String(formData.get("notes") || "").trim();
  const dosageAmount = parseNumber(formData.get("dosageAmount"));
  const dosageUnit = String(formData.get("dosageUnit") || "").trim() || undefined;
  const quantity = parseNumber(formData.get("quantity")) ?? 0;

  if (!name || !dosage || !frequency || !timeToTake) {
    return { error: "Name, dosage, frequency, and time are required." };
  }

  await dbConnect();
  await Med.create({
    userId,
    name,
    dosage,
    frequency,
    timeToTake,
    notes: notes || undefined,
    dosageAmount,
    dosageUnit,
    quantity
  });

  revalidatePath("/");
  return { error: null };
}
