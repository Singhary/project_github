"use server";

import { auth } from "@clerk/nextjs/server";
import Stripe from "stripe";
import { env } from "src/env";
import { redirect } from "next/navigation";

const stripe = new Stripe(env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-09-30.clover",
});

export async function createCheckoutSession(credits: number) {
  const { userId } = await auth();

  if (!userId) throw new Error("User not authenticated");

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "inr",
          product_data: {
            name: `${credits} Codexa Credits`,
          },
          unit_amount: Math.round((credits / 100)*10000 * 13), // Price in INR cents
        },
        quantity: 1,
      },
    ],
    customer_creation: "always",
    mode: "payment",
    success_url: `${env.NEXT_PUBLIC_APP_URL}/create`,
    cancel_url: `${env.NEXT_PUBLIC_APP_URL}/billing`,
    client_reference_id: userId.toString(),
    metadata: {
      credits,
    },
  });

  return redirect(session.url!);
}
