import { verifyToken } from "@/lib/auth";

export function requireUserIdFromRequest(req) {
  const authHeader = req.headers.get("authorization") || "";
  if (!authHeader.startsWith("Bearer ")) {
    const error = new Error("Missing token");
    error.status = 401;
    throw error;
  }

  const token = authHeader.slice(7);
  const payload = verifyToken(token);
  if (!payload?.userId) {
    const error = new Error("Invalid or expired token");
    error.status = 401;
    throw error;
  }

  return payload.userId;
}
