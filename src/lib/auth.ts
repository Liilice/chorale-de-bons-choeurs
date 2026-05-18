import jwt from "jsonwebtoken";

export type AuthResult =
  | { ok: true; payload: jwt.JwtPayload | string }
  | { ok: false; status: number; message: string };

export function verifyAdminBearer(req: Request): AuthResult {
  const authHeader = req.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return { ok: false, status: 401, message: "Missing or invalid Authorization header" };
  }

  const token = authHeader.slice("Bearer ".length).trim();
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    return { ok: false, status: 500, message: "JWT secret not configured" };
  }

  try {
    const payload = jwt.verify(token, secret);
    return { ok: true, payload };
  } catch {
    return { ok: false, status: 401, message: "Invalid or expired token" };
  }
}
