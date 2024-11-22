import { db } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get("Stripe-Signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
    console.log("Webhook event constructed:", event);
  } catch {
    return new NextResponse("Invalid signature", { status: 400 });
  }

  const session = event.data.object as Stripe.Checkout.Session;

  if (event.type === "checkout.session.completed") {
    try {
      const subsrciption = await stripe.subscriptions.retrieve(session.subscription as string);

      if (!session?.metadata?.orgId) {
        return new NextResponse("No organisation ID", { status: 400 });
      }

      await db.orgSubscription.create({
        data: {
          stripeSubscriptionId: subsrciption.id,
          stripeCustomerId: subsrciption.customer as string,
          stripePriceId: subsrciption.items.data[0].price.id,
          orgId: session?.metadata?.orgId,
          stripeCurrentPeriodEnd: new Date(
            subsrciption.current_period_end * 1000
          )
        }
      });

      console.log("Subscription data added to the database");
    } catch (error) {
      console.error("Error adding subscription data to the database", error);
      return new NextResponse("Error adding subscription data to the database", { status: 500 }); 
    }
  }

  if (event.type === "invoice.payment_succeeded") {
    const subsrciption = await stripe.subscriptions.retrieve(session.subscription as string);

    await db.orgSubscription.update({
      where: {
        stripeSubscriptionId: subsrciption.id,
      },
      data: {
        stripePriceId: subsrciption.items.data[0].price.id,
        stripeCurrentPeriodEnd: new Date(
          subsrciption.current_period_end * 1000
        )
      }
    });
  }

  return new NextResponse(null, { status: 200 });
}