import bcrypt from "bcrypt";
import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { signToken } from "@/lib/auth";
import { jsonError } from "@/lib/route-utils";
import User from "@/models/User";

export async function POST(req) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ message: "Missing email or password" }, { status: 400 });
    }

    await dbConnect();
    const user = await User.findOne({ email: String(email).toLowerCase() });
    if (!user) {
      return NextResponse.json({ message: "Invalid email or password" }, { status: 401 });
    }

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      return NextResponse.json({ message: "Invalid email or password" }, { status: 401 });
    }

    const token = signToken({ userId: user._id });
    return NextResponse.json({ token });
  } catch (error) {
    return jsonError(error);
  }
}
