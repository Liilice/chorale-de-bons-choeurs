import { db } from "./firebase-admin";

type OrderInput = {
  orderId: string;
  name: string;
  email: string;
  concertDate: string;
  concertTime: string;
  concertTitle: string;
  basePrice: number;
  quantities: number;
  amount: number;
  status: "pending" | "paid" | "failed";
  checkoutId: string | undefined;
  createdAt: string;
};

type Order = OrderInput & { id: string };

export async function createOrder(data: OrderInput): Promise<string> {
  const docRef = await db.collection("orders").add({
    orderId: data.orderId,
    name: data.name,
    email: data.email,
    concertDate: data.concertDate,
    concertTime: data.concertTime,
    concertTitle: data.concertTitle,
    basePrice: data.basePrice,
    quantities: data.quantities,
    amount: data.amount,
    status: "pending",
    checkoutId: data.checkoutId,
    createdAt: new Date().toISOString(),
  });
  return docRef.id;
}

export async function findOrderByOrderID(orderId: string): Promise<Order> {
  const snapshot = await db
    .collection("orders")
    .where("orderId", "==", orderId)
    .limit(1)
    .get();

  const doc = snapshot.docs[0];
  const data = doc.data();
  return { ...data, id: doc.id } as Order;
}

export async function updateOrder(
  documentID: string,
  update: Partial<Order>
): Promise<void> {
  await db.collection("orders").doc(documentID).update(update);
}

export async function findAllOrders(): Promise<Order[]> {
  const snapshot = await db.collection("orders").get();
  const orders = snapshot.docs.map((doc) => {
    const docData = doc.data();
    return {
      ...docData,
      id: doc.id,
    } as Order;
  });
  return orders;
}