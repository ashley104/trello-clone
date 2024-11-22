import { auth } from "@clerk/nextjs/server";
import { db } from "./db";

const DAY_IN_MS = 24 * 60 * 60 * 1000;

export const checkSubscrition = async () => {
  const { orgId } = auth();

  if (!orgId) {
    return false;
  }

  const subscription = await db.orgSubscription.findFirst({
    where: {
      orgId,
    },
    select: {
      stripeSubscriptionId: true,
      stripeCustomerId: true,
      stripeCurrentPeriodEnd: true,
      stripePriceId: true,
    }
  });

  if (!subscription) {
    return false;
  }

  const isValid = 
    subscription.stripePriceId &&
    subscription.stripeCurrentPeriodEnd?.getTime()! + DAY_IN_MS > Date.now()

  return !!isValid;
}