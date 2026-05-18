import jwt from "jsonwebtoken";

export type AdminPayload = { purpose: "admin"; role: string };
export type TicketPayload = {
  purpose: "ticket";
  tid: string;
  cd: string;
};

export type AuthResult =
  | { ok: true; payload: AdminPayload }
  | { ok: false; status: number; message: string };

export type TicketVerifyResult =
  | { ok: true; payload: TicketPayload }
  | { ok: false; status: number; message: string };

function getSecret(): string | null {
  return process.env.JWT_SECRET ?? null;
}

export function signAdminToken(): { token: string } | null {
  const secret = getSecret();
  if (!secret) return null;
  const token = jwt.sign(
    { purpose: "admin", role: "admin" } satisfies AdminPayload,
    secret,
    { expiresIn: "1d" }
  );
  return { token };
}

export function verifyAdminBearer(req: Request): AuthResult {
  const authHeader = req.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return {
      ok: false,
      status: 401,
      message: "Missing or invalid Authorization header",
    };
  }

  const token = authHeader.slice("Bearer ".length).trim();
  const secret = getSecret();

  if (!secret) {
    return { ok: false, status: 500, message: "JWT secret not configured" };
  }

  try {
    const decoded = jwt.verify(token, secret);
    if (
      typeof decoded !== "object" ||
      decoded === null ||
      (decoded as { purpose?: string }).purpose !== "admin"
    ) {
      return { ok: false, status: 401, message: "Wrong token purpose" };
    }
    return { ok: true, payload: decoded as AdminPayload };
  } catch {
    return { ok: false, status: 401, message: "Invalid or expired token" };
  }
}

export function signTicketToken(ticketId: string, concertDate: string):
  | { token: string }
  | null {
  const secret = getSecret();
  if (!secret) return null;
  const token = jwt.sign(
    { purpose: "ticket", tid: ticketId, cd: concertDate } satisfies TicketPayload,
    secret,
    { expiresIn: "365d" }
  );
  return { token };
}

export function verifyTicketToken(token: string): TicketVerifyResult {
  const secret = getSecret();
  if (!secret) {
    return { ok: false, status: 500, message: "JWT secret not configured" };
  }

  try {
    const decoded = jwt.verify(token, secret);
    if (
      typeof decoded !== "object" ||
      decoded === null ||
      (decoded as { purpose?: string }).purpose !== "ticket"
    ) {
      return { ok: false, status: 400, message: "Wrong token purpose" };
    }
    return { ok: true, payload: decoded as TicketPayload };
  } catch {
    return { ok: false, status: 400, message: "Invalid or expired QR token" };
  }
}
