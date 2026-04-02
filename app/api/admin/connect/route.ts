import { getOne } from "../../../../src/lib/admin";
import { NextRequest, NextResponse } from "next/server";
import * as bcrypt from "bcrypt";

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

  const response = NextResponse.json({
    success: true,
    message: "Connexion réussie",
  });

  response.cookies.set("admin_session", "true", {
    httpOnly: true,     
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24, // 1 jour
  });

  return response;
}