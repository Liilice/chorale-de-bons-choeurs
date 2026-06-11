import { db } from "./firebase-admin";

export type TicketUsage = {
  name: string;
  email: string;
  concertDate: string;
  concertTime: string;
  concertTitle: string;
  quantitiesBuy: number;
  quantities: number;
  createdAt: string;
};

export type GroupedTicketUsage = {
  concertDate: string;
  tickets: TicketUsage[];
};

export type TicketUsageWithID = TicketUsage & { id: string };

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
  const docRef = db.collection("ticketUsage").doc(documentID);
  if (!(await docRef.get()).exists) {
    throw new Error("Document not found");
  }
  const quantitiesBuy = (await docRef.get()).data()?.quantitiesBuy;
  if(update.quantities && (update.quantities > quantitiesBuy || update.quantities < 0)) {
    throw new Error("Invalid quantities value");
  }

  await db.collection("ticketUsage").doc(documentID).update(update);
}

// export async function findAllTicketUsage(): Promise<TicketUsageWithID[]> {
//   const snapshot = await db.collection("ticketUsage").get();
//   const ticketUsage = snapshot.docs.map((doc) => {
//     const docData = doc.data();
//     return {
//       ...docData,
//       id: doc.id,
//     } as TicketUsageWithID;
//   });
//   return ticketUsage;
// }

export async function findAllTicketUsage(): Promise<
  GroupedTicketUsage[]
> {
  const snapshot = await db.collection("ticketUsage").get();
  const ticketUsage = snapshot.docs.map(
    (doc) =>
      ({
        ...doc.data(),
        id: doc.id,
      } as TicketUsageWithID)
  );

  const grouped = ticketUsage.reduce<Record<string, TicketUsageWithID[]>>(
    (acc, ticket) => {
      (acc[ticket.concertDate] ??= []).push(ticket);
      return acc;
    },
    {}
  );

  return Object.entries(grouped).map(([concertDate, tickets]) => ({
    concertDate,
    tickets,
  }));
}

export type ScanOutcome =
  | { status: "ok"; ticket: TicketUsageWithID }
  | { status: "already_used"; ticket: TicketUsageWithID }
  | { status: "not_found" };

export async function findTicketUsage(
  documentID: string
): Promise<TicketUsageWithID | null> {
  const snap = await db.collection("ticketUsage").doc(documentID).get();
  if (!snap.exists) return null;
  return { ...(snap.data() as TicketUsage), id: snap.id };
}

export async function consumeOneTicket(
  documentID: string
): Promise<ScanOutcome> {
  const ref = db.collection("ticketUsage").doc(documentID);

  return db.runTransaction<ScanOutcome>(async (tx) => {
    const snap = await tx.get(ref);
    if (!snap.exists) {
      return { status: "not_found" };
    }

    const data = snap.data() as TicketUsage;
    const ticket: TicketUsageWithID = { ...data, id: snap.id };

    if (data.quantities <= 0) {
      return { status: "already_used", ticket };
    }

    const newQty = data.quantities - 1;
    tx.update(ref, { quantities: newQty });

    return {
      status: "ok",
      ticket: { ...ticket, quantities: newQty },
    };
  });
}
