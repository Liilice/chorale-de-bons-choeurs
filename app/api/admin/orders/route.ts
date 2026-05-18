import { findAllOrders } from "../../../../src/lib/orders";
import { verifyAdminBearer } from "../../../../src/lib/auth";

export async function GET(req: Request) {
  const auth = verifyAdminBearer(req);
  if (!auth.ok) {
    return Response.json({ error: auth.message }, { status: auth.status });
  }

  try {
    const orders = await findAllOrders();
    return Response.json(orders);
  } catch (error) {
    return Response.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}
