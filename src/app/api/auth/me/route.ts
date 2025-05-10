import { getCurrentUser } from "@/services/auth";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const user = await getCurrentUser();
    return NextResponse.json({ user });
  } catch (error) {
    return NextResponse.json({ user: null }, { status: 401 });
  }
}
