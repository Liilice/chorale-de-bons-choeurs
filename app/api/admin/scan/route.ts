import { NextRequest, NextResponse } from "next/server";
import { verifyAdminBearer, verifyTicketToken } from "../../../../src/lib/auth";
import { consumeOneTicket } from "../../../../src/lib/ticket_usages";

type ScanRequestBody = {
  ticketToken?: string;
  qrUrl?: string;
};

function extractToken(body: ScanRequestBody): string | null {
  if (body.ticketToken) return body.ticketToken;
  if (body.qrUrl) {
    try {
      const url = new URL(body.qrUrl);
      return url.searchParams.get("t");
    } catch {
      return null;
    }
  }
  return null;
}

export async function POST(req: NextRequest) {
  const auth = verifyAdminBearer(req);
  if (!auth.ok) {
    return NextResponse.json(
      { status: "unauthorized", message: auth.message },
      { status: auth.status }
    );
  }

  let body: ScanRequestBody;
  try {
    body = (await req.json()) as ScanRequestBody;
  } catch {
    return NextResponse.json(
      { status: "invalid", message: "Invalid JSON body" },
      { status: 400 }
    );
  }

  const token = extractToken(body);
  if (!token) {
    return NextResponse.json(
      { status: "invalid", message: "Missing ticket token" },
      { status: 400 }
    );
  }

  const verified = verifyTicketToken(token);
  if (!verified.ok) {
    return NextResponse.json(
      { status: "invalid", message: verified.message },
      { status: verified.status }
    );
  }

  const { tid, cd } = verified.payload;

  const outcome = await consumeOneTicket(tid);

  if (outcome.status === "not_found") {
    return NextResponse.json(
      { status: "not_found", message: "Ticket inconnu" },
      { status: 404 }
    );
  }

  const { ticket } = outcome;

  return NextResponse.json({
    status: outcome.status,
    name: ticket.name,
    email: ticket.email,
    concertTitle: ticket.concertTitle,
    concertDate: ticket.concertDate,
    concertTime: ticket.concertTime,
    remaining: ticket.quantities,
    totalBought: ticket.quantitiesBuy,
    expectedConcertDate: cd,
  });
}
