"use server";

import bcrypt from "bcryptjs";
import * as z from "zod";
import { RegisterSchema } from "@/schemas";
import { db } from "@/lib/db";
import { getUserByEmail } from "@/utils/get-user/getUserByEmail";
import { generateVerificationToken } from "@/utils/generate-tokens/generateVerificationToken";
import { sendVerificationEmail } from "@/lib/mail";

export const register = async (values: z.infer<typeof RegisterSchema>) => {
    const validatedFields = RegisterSchema.safeParse(values);

    // Checking if the fields are valid
    if (!validatedFields.success) {
        return {
            error: "Invalid fields!",
        };
    }

    // Extracting validated fields
    const { email, password, name } = validatedFields.data;

    // Hashing the password (using salt rounds of 10)
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

    // Generating Verification Token
    const verificationToken = await generateVerificationToken(email);

    // Sending verification token email
    await sendVerificationEmail(
        verificationToken.email,
        verificationToken.token,
        name
    );

    return { success: "Account created! Please verify your email!" };
};
