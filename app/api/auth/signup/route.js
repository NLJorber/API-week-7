import bcrypt from "bcrypt";
import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { jsonError } from "@/lib/route-utils";
import User from "@/models/User";

export async function POST(req) {
  try {
    const { email, password, name } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    await dbConnect();
    const normalizedEmail = String(email).toLowerCase();
    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) {
      return NextResponse.json({ message: "Email already registered" }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    await User.create({ email: normalizedEmail, passwordHash, name });

    return NextResponse.json({ message: "Welcome!!" });
  } catch (error) {
    return jsonError(error);
  }
}
