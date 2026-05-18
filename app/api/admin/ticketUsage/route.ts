import { findAllTicketUsage, updateTicketUsage } from "../../../../src/lib/ticket_usages";
import { verifyAdminBearer } from "../../../../src/lib/auth";

export async function GET(req: Request) {
  const auth = verifyAdminBearer(req);
  if (!auth.ok) {
    return Response.json({ error: auth.message }, { status: auth.status });
  }

  try {
    const ticketUsages = await findAllTicketUsage();
    return Response.json(ticketUsages);
  } catch {
    return Response.json(
      { error: "Failed to fetch ticket usages" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  const auth = verifyAdminBearer(req);
  if (!auth.ok) {
    return Response.json({ error: auth.message }, { status: auth.status });
  }

  try {
    const body = await req.json();
    const { id, quantities } = body as { id: string; quantities: number };

    if (typeof quantities !== "number" || quantities < 0) {
      return Response.json(
        { error: "Invalid quantities value" },
        { status: 400 }
      );
    }

    await updateTicketUsage(id, { quantities: quantities });

    return Response.json({ success: true });
  } catch {
    return Response.json({ error: "Failed to update order" }, { status: 500 });
  }
}
