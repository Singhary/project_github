import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { env } from "src/env";
import { db } from "~/server/db";

const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-09-30.clover",
});

export async function POST(request: Request, response: NextResponse) {
  const body = await request.text();
  console.log("Received Stripe webhook:", body);

  const signature = ((await headers()).get("Stripe-Signature") as string) || "";

  let event: Stripe.Event;

  try {
    event = Stripe.webhooks.constructEvent(
      body,
      signature,
      env.STRIPE_WEBHOOK_SECRET,
    );
    console.log("Verified Stripe webhook event:", event);
  } catch (error) {
    return NextResponse.json({ error: "Invalid signature." }, { status: 400 });
  }

  const session = event.data.object as Stripe.Checkout.Session;

  if (event.type === "checkout.session.completed") {
    const credits = Number(session.metadata?.["credits"]);
    const userId = session.client_reference_id as string;

    if (!userId || !credits) {
      return NextResponse.json(
        { error: "Missing user ID or credits in session metadata." },
        { status: 400 },
      );
    }

    console.log(`User ${userId} purchased ${credits} credits.`);

    await db.stripeTransaction.create({
      data: {
        userId,
        creditsPurchased: credits,
      },
    });

    await db.user.update({
      where: { id: userId },
      data: {
        credits: {
          increment: credits,
        },
      },
    });

    return NextResponse.json({ message: "Credits added successfully." } , { status: 200 });

  }

  return NextResponse.json({
    message: "Stripe webhook route is under construction.",
  });
}
