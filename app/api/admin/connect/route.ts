import { getOne } from "../../../../src/lib/admin";
import { NextRequest, NextResponse } from "next/server";
import * as bcrypt from "bcrypt";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { password } = body as { password: string };
  const existingHashedPassword = await getOne();
  if (existingHashedPassword) {
    const isMatch = await bcrypt.compare(password, existingHashedPassword);
    if (isMatch) {
      return NextResponse.json({
        success: true,
        message: "password is correct.",
      });
    } else {
      return NextResponse.json({
        success: false,
        message: "password is incorrect.",
      });
    }
  }
}
