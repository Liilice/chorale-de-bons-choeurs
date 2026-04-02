import SumUp from "@sumup/sdk";
import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { findOrderByOrderID, updateOrder } from "../../../../src/lib/orders";
import { createTicketUsage } from "../../../../src/lib/ticket_usages";

enum Status {
  PENDING = "pending",
  PAID = "paid",
  FAILED = "failed",
}

const client = new SumUp({
  apiKey: process.env.SUMUP_API_KEY,
});

function getConfirmationEmailTemplate({
  customerName,
  concertTitle,
}: {
  customerName: string;
  concertTitle: string;
}) {
  return `
    <div style="font-family: Arial, Helvetica, sans-serif; background-color: #f9fafb; padding: 32px;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; padding: 32px; border: 1px solid #e5e7eb;">
        <h1 style="margin: 0 0 16px; font-size: 28px; color: #111827;">
          Payment confirmed
        </h1>

        <p style="margin: 0 0 12px; font-size: 16px; color: #374151;">
          Hello ${customerName},
        </p>

        <p style="margin: 0 0 12px; font-size: 16px; color: #374151;">
          Thank you for your purchase. Your payment for <strong>${concertTitle}</strong> has been successfully confirmed.
        </p>

        <p style="margin: 0 0 12px; font-size: 16px; color: #374151;">
          Your booking has been recorded successfully. You will receive your ticket details shortly.
        </p>

        <div style="margin-top: 24px; padding: 16px; background-color: #f3f4f6; border-radius: 8px; font-size: 14px; color: #4b5563;">
          If you do not receive another email within a few minutes, please check your spam or junk folder.
        </div>
      </div>
    </div>
  `;
}

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
    console.log("Détails du checkout récupérés:", checkout);

    const status = checkout.status;
    const reference = checkout.checkout_reference;

    if (!reference) {
      return new NextResponse(null, { status: 204 });
    }

    const order = await findOrderByOrderID(reference);

    if (status === "PAID") {
      await updateOrder(order.id, { status: Status.PAID });
      await createTicketUsage({
        name: order.name,
        email: order.email,
        concertDate: order.concertDate,
        concertTime: order.concertTime,
        concertTitle: order.concertTitle,
        quantitiesBuy: order.quantities,
        quantities: order.quantities,
        createdAt: new Date().toISOString(),
      });
      // TODO:
      // 4. stocker paidAt, checkoutId, transactionId
      // 5. générer billet + QR code côté serveur
      // const transporter = nodemailer.createTransport({
      //   host: "smtp.gmail.com",
      //   port: 587,
      //   auth: {
      //     user: process.env.GMAIL_USERNAME,
      //     pass: process.env.GMAIL_PASSWORD,
      //   },
      // });
      // try {
      //   await transporter.sendMail({
      //     from: process.env.GMAIL_USERNAME,
      //     to: order.email,
      //     subject: `Chorale confirmation`,
      //     text: `Hello ${order.email}, your payment has been confirmed.`,
      //     html: getConfirmationEmailTemplate({
      //       customerName: `${order.email}`,
      //       concertTitle: "Concert de la Chorale",
      //     }),
      //   });
      //   return NextResponse.json({ success: true, message: "Email sent successfully!" });
      // } catch (error) {
      //   console.error(error);
      //   return NextResponse.json({ success: false, message: "Failed to send email." });
      // }
    } else if (status === "FAILED") {
      await updateOrder(order.id, { status: Status.FAILED });
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
