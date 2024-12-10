"use server";

import * as z from "zod";
import { db } from "@/lib/db";
import { SettingsSchema } from "@/schemas";
import { getUserById } from "@/utils/get-user/getUserById";
import { currentUser } from "@/utils/server-current-user/currentUser";
import { getUserByEmail } from "@/utils/get-user/getUserByEmail";
import { generateVerificationToken } from "@/utils/generate-tokens/generateVerificationToken";
import { sendVerificationEmail } from "@/lib/mail";
import bcrypt from "bcryptjs";

export const settings = async (values: z.infer<typeof SettingsSchema>) => {
    const user = await currentUser();

    if (!user) {
        return { error: "unauthorized" };
    }

    const existingUser = await getUserById(user.id || "");

    if (!existingUser) {
        return { error: "unauthorized" };
    }

    if (user.isOAuth) {
        // Disabling these fields for OAuth accounts
        values.email = undefined;
        values.password = undefined;
        values.newPassword = undefined;
        values.isTwoFactorEnabled = undefined;
    }

    // Handling email
    if (values.email && values.email !== user.email) {
        const existingUser = await getUserByEmail(values.email);

        // Checking if email already exists and belongs to a different user
        if (existingUser && existingUser.id !== user.id) {
            return { error: "Email already in use!" };
        }

        // Creating new verification token
        const verificationToken = await generateVerificationToken(values.email);

        // Sending verification email
        await sendVerificationEmail(
            verificationToken.email,
            verificationToken.token,
            user.name || "User"
        );

        // return { success: "Verification email sent" };
        // removing verification
        await db.user.update({
            where: {
                id: user.id,
            },
            data: {
                emailVerified: null,
            },
        });
    }

    // Handling passwords
    if (values.password && values.newPassword && existingUser.password) {
        // Checking if password is correct
        const passwordsMatch = await bcrypt.compare(
            values.password,
            existingUser.password
        );

        if (!passwordsMatch) {
            return { error: "Invalid password!" };
        }

        // Hashing new password
        const hashedPassword = await bcrypt.hash(values.newPassword, 10);

        // Updating the password
        values.password = hashedPassword;

        // Discarding 'new password' (not used in the database)
        values.newPassword = undefined;
    }

    await db.user.update({
        where: {
            id: existingUser.id,
        },
        data: {
            ...values,
        },
    });

    return { success: "settings updated" };
};
