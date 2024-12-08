"use server";

import bcrypt from "bcryptjs";
import * as z from "zod";
// import { Prisma } from "@prisma/client";
import { RegisterSchema } from "@/schemas";
import { db } from "@/lib/db";
// import { getUserByEmail } from "@/utils/getUserByEmail";
import { getUserByEmail } from "@/utils/user";

export const register = async (values: z.infer<typeof RegisterSchema>) => {
    const validatedFields = RegisterSchema.safeParse(values);

    if (!validatedFields.success) {
        return {
            error: "Invalid fields!",
        };
    }

    const { email, password, name } = validatedFields.data;

    const hashedPassword = await bcrypt.hash(password, 10);

    // Confirming whether if the email is not taken
    const existingUser = await getUserByEmail(email);

    // Email is taken
    if (existingUser) {
        return {
            error: "Email already in use!",
        };
    }

    // Creating the user
    await db.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
        },
    });

    // TODO: Send verification token email

    return { success: "Account created!" };
};
