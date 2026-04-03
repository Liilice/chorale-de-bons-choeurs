import { createAdmin } from "../../../../src/lib/admin";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { password } = body as { password: string };
  const admin = await createAdmin({ password });
  if (!admin) {
    return NextResponse.json({
      success: false,
      message: "Failed to create admin.",
    });
  }
  return NextResponse.json({
    success: true,
    message: "Admin created successfully!",
  });
}
