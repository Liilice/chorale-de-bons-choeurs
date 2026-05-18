import { getOne } from "../../../../src/lib/admin";
import { NextRequest, NextResponse } from "next/server";
import * as bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { password } = body as { password: string };

  const existingHashedPassword = await getOne();

  if (!existingHashedPassword) {
    return NextResponse.json(
      { success: false, message: "No admin configured." },
      { status: 500 }
    );
  }

  const isMatch = await bcrypt.compare(password, existingHashedPassword);

  if (!isMatch) {
    return NextResponse.json(
      { success: false, message: "Mot de passe incorrect." },
      { status: 401 }
    );
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    return NextResponse.json(
      { success: false, message: "JWT secret not configured." },
      { status: 500 }
    );
  }

  const token = jwt.sign({ role: "admin" }, secret, { expiresIn: "1d" });

  return NextResponse.json({
    success: true,
    message: "Connexion réussie",
    token,
  });
}
