import { findAllOrders } from "../../../../src/lib/orders";

export async function GET(req: Request) {
  try {
    const orders = await findAllOrders();
    return Response.json(orders);
  } catch (error) {
    return Response.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}
