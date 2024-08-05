"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

export type State = {
    errors?: {
        title?: string[];
    },
    message?: string | null;
}

const CreateBoard = z.object({
    title: z.string().min(3, {
        message: "Title must be at least 3 characters long"
    }),
});

export async function create(prevState: State, formData: FormData): Promise<State> {
    const validateFields = CreateBoard.safeParse({
        title: formData.get("title"),
    })

    if (!validateFields.success) {
        return {
            errors: validateFields.error.flatten().fieldErrors,
            message: "Missing required fields"
        }
    }

    const { title } = validateFields.data;

    try {
        await db.board.create({
            data: {
                title,
            }
        });
    } catch (error) {
        return {
            message: "Database error"
        }
    }

    revalidatePath("/organization/org_2kANh0bQfHrtSPmSWBOw3TygJw2");
    redirect("/organization/org_2kANh0bQfHrtSPmSWBOw3TygJw2");
}