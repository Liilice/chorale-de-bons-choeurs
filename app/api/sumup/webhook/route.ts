import SumUp from "@sumup/sdk";
import { NextRequest, NextResponse } from "next/server";

const client = new SumUp({
  apiKey: process.env.SUMUP_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();

    console.log("Webhook SumUp reçu:", payload);

    const eventType = payload?.event_type;
    const checkoutId = payload?.id;

    if (eventType !== "CHECKOUT_STATUS_CHANGED" || !checkoutId) {
      return new NextResponse(null, { status: 204 });
    }

    const checkout = await client.checkouts.get(checkoutId);

    const status = checkout.status;
    const reference = checkout.checkout_reference;

    if (!reference) {
      console.error("Pas de checkout_reference sur le checkout:", checkoutId);
      return new NextResponse(null, { status: 204 });
    }

    console.log("Checkout reverifié:", {
      checkoutId,
      reference,
      status,
    });

    if (status === "PAID") {
      // TODO:
      // 1. retrouver order par id = reference
      // 2. si déjà paid => ne rien refaire
      // 3. sinon update order.status = "paid"
      // 4. stocker paidAt, checkoutId, transactionId
      // 5. générer billet + QR code côté serveur
      console.log("Paiement confirmé:", reference);
    } else if (status === "FAILED") {
      // TODO: order.status = "failed"
      console.log("Paiement échoué:", reference);
    } else if (status === "PENDING") {
      console.log("Paiement encore en attente:", reference);
    }

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Erreur webhook SumUp:", error);
    return new NextResponse(null, { status: 500 });
  }
}