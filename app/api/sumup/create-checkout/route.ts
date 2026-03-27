import SumUp from "@sumup/sdk";
import { NextRequest, NextResponse } from "next/server";

const client = new SumUp({
  apiKey: process.env.SUMUP_API_KEY,
});

type TicketInput = {
  type: "adult" | "student" | "child" | "senior";
  quantity: number;
};

const PRICE_RULES = {
  adult: 1,
  student: 0.75,
  child: 0.5,
  senior: 0.8,
} as const;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      customerName,
      customerEmail,
      concertId,
      concertTitle,
      basePrice,
      tickets,
    } = body as {
      customerName: string;
      customerEmail: string;
      concertId: number;
      concertTitle: string;
      basePrice: number;
      tickets: TicketInput[];
    };

    if (
      !customerName ||
      !customerEmail ||
      !concertId ||
      !concertTitle ||
      !basePrice ||
      !Array.isArray(tickets)
    ) {
      return NextResponse.json({ error: "Payload invalide" }, { status: 400 });
    }

    const normalizedTickets = tickets
      .filter((t) => t.quantity > 0)
      .map((t) => ({
        ...t,
        unitPrice: Number((basePrice * PRICE_RULES[t.type]).toFixed(2)),
      }));

    if (normalizedTickets.length === 0) {
      return NextResponse.json(
        { error: "Aucun billet sélectionné" },
        { status: 400 }
      );
    }

    const amount = Number(
      normalizedTickets
        .reduce((sum, t) => sum + t.unitPrice * t.quantity, 0)
        .toFixed(2)
    );

    // TODO: créer une vraie commande en base
    const orderId = crypto.randomUUID();

    // Exemple d'objet commande local
    const localOrder = {
      id: orderId,
      name: customerName,
      email: customerEmail,
      concertId,
      concertTitle,
      tickets: normalizedTickets,
      amount,
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    console.log("Commande locale créée:", localOrder);

    const checkout = await client.checkouts.create({
      amount,
      checkout_reference: orderId,
      currency: "EUR",
      merchant_code: process.env.SUMUP_MERCHANT_CODE!,
      description: `${customerName} - ${customerEmail} - ${concertTitle} - ${normalizedTickets
        .map((t) => `${t.quantity}x ${t.type}`)
        .join(", ")}`,
      return_url: process.env.SUMUP_WEBHOOK_URL!,
    });

    // TODO: sauvegarder aussi checkout.id sur la commande
    console.log("Checkout SumUp créé:", checkout.id);

    return NextResponse.json({
      orderId,
      checkoutId: checkout.id,
      amount,
    });
  } catch (error) {
    console.error("Erreur create-checkout SumUp:", error);
    return NextResponse.json(
      { error: "Impossible de créer le checkout SumUp" },
      { status: 500 }
    );
  }
}
