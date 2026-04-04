import SumUp from "@sumup/sdk";
import { NextRequest, NextResponse } from "next/server";
import { findOrCreateUser, findAll } from "../../../../src/lib/users";
import { createOrder } from "../../../../src/lib/orders";

const client = new SumUp({
  apiKey: process.env.SUMUP_API_KEY,
});

enum Status {
  PENDING = "pending",
  PAID = "paid",
  FAILED = "failed",
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      customerName,
      customerEmail,
      concertDate,
      concertTime,
      concertTitle,
      basePrice,
      quantities,
    } = body as {
      customerName: string;
      customerEmail: string;
      concertDate: string;
      concertTime: string;
      concertTitle: string;
      basePrice: number;
      quantities: number;
    };

    if (
      !customerName ||
      !customerEmail ||
      !concertDate ||
      !concertTime ||
      !concertTitle ||
      !basePrice ||
      !quantities
    ) {
      return NextResponse.json({ error: "Payload invalide" }, { status: 400 });
    }

    const customer = await findOrCreateUser({
      name: customerName,
      email: customerEmail,
    });

    console.log("Customer trouvé ou créé:", customer);

    const amount = Number(quantities*basePrice);

    const orderId = crypto.randomUUID();

    const checkout = await client.checkouts.create({
      amount,
      // customer_id: customer.customerId,
      checkout_reference: orderId,
      currency: "EUR",
      merchant_code: process.env.SUMUP_MERCHANT_CODE!,
      description: `${customerName} - ${customerEmail} - ${concertTitle} - ${concertDate} - ${quantities}`,
      return_url: process.env.SUMUP_WEBHOOK_URL!,
    });

    await createOrder({
      orderId: orderId,
      name: customerName,
      email: customerEmail,
      concertDate,
      concertTime,
      concertTitle,
      basePrice,
      quantities,
      amount,
      status: Status.PENDING,
      checkoutId: checkout.id,
      createdAt: new Date().toISOString(),
    });

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
