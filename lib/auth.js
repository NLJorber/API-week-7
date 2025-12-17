import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-me";

export function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

export function getTokenFromCookies() {
  return cookies().get("token")?.value || null;
}

export function getUserIdFromCookies() {
  const token = getTokenFromCookies();
  const payload = token ? verifyToken(token) : null;
  return payload?.userId || null;
}

export function requireUserId() {
  const userId = getUserIdFromCookies();
  if (!userId) {
    const error = new Error("Missing token");
    error.status = 401;
    throw error;
  }
  return userId;
}
