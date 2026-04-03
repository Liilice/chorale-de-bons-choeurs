import { findAllTicketUsage, updateTicketUsage } from "../../../../src/lib/ticket_usages";

export async function GET(req: Request) {
  try {
    const ticketUsages = await findAllTicketUsage();
    return Response.json(ticketUsages);
  } catch (error) {
    return Response.json(
      { error: "Failed to fetch ticket usages" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: Request,
) {
  try {
    const body = await req.json();
    const { id, quantities } = body as { id: string; quantities: number };

    if (typeof quantities !== "number" || quantities < 0) {
      return Response.json(
        { error: "Invalid quantities value" },
        { status: 400 }
      );
    }

    await updateTicketUsage(id, {quantities : quantities });

    return Response.json({ success: true });
  } catch {
    return Response.json({ error: "Failed to update order" }, { status: 500 });
  }
}
