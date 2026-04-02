import { db } from "./firebase-admin";

type TicketUsage = {
  name: string;
  email: string;
  concertDate: string;
  concertTime: string;
  concertTitle: string;
  quantitiesBuy: number;
  quantities: number;
  createdAt: string;
};

type TicketUsageWithID = TicketUsage & { id: string };

export async function createTicketUsage(data: TicketUsage): Promise<string> {
  const docRef = await db.collection("ticketUsage").add({
    name: data.name,
    email: data.email,
    concertDate: data.concertDate,
    concertTime: data.concertTime,
    concertTitle: data.concertTitle,
    quantitiesBuy: data.quantities,
    quantities: data.quantities,
    createdAt: data.createdAt,
  });
  return docRef.id;
}

export async function updateTicketUsage(
  documentID: string,
  update: Partial<TicketUsage>
): Promise<void> {
  await db.collection("ticketUsage").doc(documentID).update(update);
}

export async function findAllTicketUsage(): Promise<TicketUsageWithID[]> {
  const snapshot = await db.collection("ticketUsage").get();
  const ticketUsage = snapshot.docs.map((doc) => {
    const docData = doc.data();
    return {
      ...docData,
      id: doc.id,
    } as TicketUsageWithID;
  });
  return ticketUsage;
}