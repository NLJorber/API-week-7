"use server";

import bcrypt from "bcrypt";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import dbConnect from "@/lib/db";
import { signToken } from "@/lib/auth";
import User from "@/models/User";

function setAuthCookie(token) {
  cookies().set("token", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/"
  });
}

export async function loginAction(prevState, formData) {
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  await dbConnect();
  const user = await User.findOne({ email });
  if (!user) {
    return { error: "Invalid email or password." };
  }

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) {
    return { error: "Invalid email or password." };
  }

  const token = signToken({ userId: user._id });
  setAuthCookie(token);
  revalidatePath("/");
  redirect("/");
}

export async function signupAction(prevState, formData) {
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");
  const nameRaw = String(formData.get("name") || "").trim();
  const name = nameRaw || email.split("@")[0] || "User";

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  await dbConnect();
  const exists = await User.findOne({ email });
  if (exists) {
    return { error: "Email already registered." };
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({ email, passwordHash, name });
  const token = signToken({ userId: user._id });
  setAuthCookie(token);
  revalidatePath("/");
  redirect("/");
}

export async function logoutAction() {
  cookies().set("token", "", { maxAge: 0, path: "/" });
  revalidatePath("/");
  redirect("/");
}
