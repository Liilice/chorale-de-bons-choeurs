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
  customerEmail,
  concertTitle,
  concertDate,
  concertTime,
  quantitiesBuy,
  basePrice,
}: {
  customerName: string;
  customerEmail: string;
  concertTitle: string;
  concertDate: string;
  concertTime: string;
  quantitiesBuy: number;
  basePrice: number;
}) {
  return `
    <div style="font-family: Arial, Helvetica, sans-serif; background-color: #f9fafb; padding: 32px 10px;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e5e7eb;">

    <!-- Header -->
    <div style="background: linear-gradient(135deg, #dc2626, #f97316); padding: 24px; text-align: center; color: white;">
      <h1 style="margin: 0; font-size: 26px;">
        🎶 Concert de Printemps
      </h1>
      <p style="margin: 8px 0 0; font-size: 14px; opacity: 0.9;">
        Chorale de Bons Chœurs
      </p>
    </div>

    <!-- Content -->
    <div style="padding: 28px;">

      <p style="margin: 0 0 12px; font-size: 16px; color: #374151;">
        Bonjour <strong>${customerName}</strong>,
      </p>

      <p style="margin: 0 0 16px; font-size: 16px; color: #374151;">
        🎉 Votre réservation pour le <strong>${concertTitle}</strong> a bien été confirmée avec l'e-mail suivant :  <strong>${customerEmail}</strong>!
      </p>

      <p style="margin: 0 0 16px; font-size: 16px; color: #374151;">
        Nous avons le plaisir de vous accueillir pour une soirée exceptionnelle pleine d’émotions et de musique.
      </p>

      <!-- Infos concert -->
      <div style="background-color: #f3f4f6; padding: 16px; border-radius: 8px; margin: 20px 0;">
        <p style="margin: 0 0 8px; font-size: 14px; color: #111827;">
          📅 <strong>Date :</strong> ${concertDate}
        </p>
        <p style="margin: 0 0 8px; font-size: 14px; color: #111827;">
          ⏰ <strong>Heure :</strong> ${concertTime}
        </p>
        <p style="margin: 0; font-size: 14px; color: #111827;">
          📍 <strong>Lieu :</strong> Église anglicane de Gustavia
        </p>
      </div>

      <!-- Description -->
      <p style="margin: 0 0 16px; font-size: 15px; color: #374151;">
        🎼 Au programme : Classique, Moderne, Gospel et Créole
      </p>

      <p style="margin: 0 0 16px; font-size: 15px; color: #374151;">
        ✨ Voix puissantes, émotions et partage vous attendent !
      </p>

      <!-- Info prix -->
      <div style="margin: 20px 0; padding: 16px; border-radius: 10px; background-color: #fff7ed; border: 1px solid #fed7aa;">
        <table style="width: 100%; font-size: 14px; color: #9a3412;">
          <tr>
            <td style="padding: 4px 0;">🎟 Billets</td>
            <td style="padding: 4px 0; text-align: right;">
              ${quantitiesBuy}
            </td>
          </tr>
          <tr>
            <td style="padding: 4px 0;">Prix unitaire</td>
            <td style="padding: 4px 0; text-align: right;">
              ${basePrice}€
            </td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold;">Total</td>
            <td style="padding: 8px 0; text-align: right; font-weight: bold;">
              ${quantitiesBuy * basePrice}€
            </td>
          </tr>
        </table>
      </div>

      <!-- Footer note -->
      <p style="margin: 24px 0 12px; font-size: 14px; color: #6b7280;">
        Si vous ne recevez pas vos informations dans les prochaines minutes, pensez à vérifier vos spams.
      </p>

      <p style="margin: 0; font-size: 16px; color: #111827; font-weight: bold;">
        À très bientôt 🎶
      </p>

    </div>

    <!-- Footer -->
    <div style="text-align: center; padding: 16px; font-size: 12px; color: #9ca3af;">
      Chorale de Bons Chœurs — Concert de soutien pour notre voyage en Suède 🇸🇪
    </div>

  </div>
</div>
  `;
}

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();
    const eventType = payload?.event_type;
    const checkoutId = payload?.id;

    if (eventType !== "CHECKOUT_STATUS_CHANGED" || !checkoutId) {
      return new NextResponse(null, { status: 204 });
    }

    const checkout = await client.checkouts.get(checkoutId);
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
      const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        auth: {
          user: process.env.GMAIL_USERNAME,
          pass: process.env.GMAIL_PASSWORD,
        },
      });
      try {
        await transporter.sendMail({
          from: process.env.GMAIL_USERNAME,
          to: order.email,
          subject: `Chorale confirmation`,
          html: getConfirmationEmailTemplate({
            customerName: order.name,
            customerEmail: order.email,
            concertTitle: order.concertTitle,
            concertDate: order.concertDate,
            concertTime: order.concertTime,
            quantitiesBuy: order.quantities,
            basePrice: order.basePrice,
          }),
        });
        return NextResponse.json({
          success: true,
          message: "Email sent successfully!",
        });
      } catch (error) {
        console.error(error);
        return NextResponse.json({
          success: false,
          message: "Failed to send email.",
        });
      }
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
