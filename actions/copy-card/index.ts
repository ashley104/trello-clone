"use server";

import { auth } from "@clerk/nextjs/server";
import { InputType, ReturnType } from "./types";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { createSafeAction } from "@/lib/create-safe-action";
import { CopyCard } from "./schema";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = auth();

  if (!userId || !orgId) {
    return {
      error: "Unauthorised"
    };
  }

  const { id, boardId } = data;
  let card;

  try {
    const cardToCopy = await db.card.findUnique({
      where: {
        id,
        list: {
          board: {
            orgId,
          },
        },
      },
    });

    if (!cardToCopy) {
      return {
        error: "card not found."
      }
    }

    const lastcard = await db.card.findFirst({
      where: {
        listId: cardToCopy.listId
      },
      orderBy: {
        order: "desc"
      },
      select: {
        order: true
      }
    });

    const newOrder = lastcard ? lastcard.order + 1 : 1;

    card = await db.card.create({
      data: {
        title: `${cardToCopy.title}-copy`,
        description: cardToCopy.description,
        listId: cardToCopy.listId,
        order: newOrder,
      },
    });
  } catch (error) {
    return {
      error: "Failed to copy."
    }
  }

  revalidatePath(`/board/${boardId}`);
  return{data: card};
}

export const copyCard = createSafeAction(CopyCard, handler);