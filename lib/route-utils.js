import { NextResponse } from "next/server";

export function jsonError(error) {
  const status = error.status || 500;
  const message = error.message || "Server error";
  return NextResponse.json({ message }, { status });
}
