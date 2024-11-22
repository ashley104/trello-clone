"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { InputType, ReturnType } from "./types";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { createSafeAction } from "@/lib/create-safe-action";
import { StripeRedirect } from "./schema";
import { absoluteUrl } from "@/lib/utils";
import { stripe } from '@/lib/stripe';

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = auth();
  const user = await currentUser();

  if (!userId || !orgId || !user) {
    return {
      error: "Unauthorised"
    };
  }

  const settingUrl = absoluteUrl(`/organization/${orgId}`);

  let url = "";

  try {
    const orgSubscription = await db.orgSubscription.findFirst({
      where: {
        orgId: orgId
      }
    });

    if (orgSubscription && orgSubscription.stripeCustomerId) {
      const stripeSession = await stripe.billingPortal.sessions.create({
        customer: orgSubscription.stripeCustomerId,
        return_url: settingUrl,
      });

      url = stripeSession.url;
    } else {
      const stripeSession = await stripe.checkout.sessions.create({
        billing_address_collection: 'auto',
        customer_email: user.emailAddresses[0].emailAddress,
        mode: 'subscription',
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'AUD',
              product_data: {
                name: 'Trello Pro',
                description: "Unlimited boards for your organisation",
              },
              unit_amount: 25,
              recurring: {
                interval: 'month',
              },
            },
            quantity: 1,
          },
        ],
        success_url: settingUrl,
        cancel_url: settingUrl,
        metadata: {
          orgId
        },
      });

      url = stripeSession.url || "";
    }
  } catch (error) {
    console.error(error);
    return {
      error: "Failed to create Stripe session"
    };
  };

  revalidatePath(`/organization/${orgId}`);
  return { data: url };
}

export const stripeRedirect = createSafeAction(StripeRedirect, handler);