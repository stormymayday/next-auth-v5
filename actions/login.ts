"use server";

import * as z from "zod";
import { LoginSchema } from "@/schemas";
import { signIn } from "@/auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { AuthError } from "next-auth";
import { getUserByEmail } from "@/utils/get-user/getUserByEmail";
import { generateVerificationToken } from "@/utils/generate-tokens/generateVerificationToken";
import { sendVerificationEmail, sendTwoFactorTokenEmail } from "@/lib/mail";
import { generateTwoFactorToken } from "@/utils/generate-tokens/generateTwoFactorToken";
import { getTwoFactorTokenByEmail } from "@/utils/get-two-factor-tokens/getTwoFactorTokenByEmail";
import { getTwoFactorConfirmationByUserId } from "@/utils/get-two-factor-confirmation/getTwoFactorConfirmationByUserId";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";

export const login = async (
    values: z.infer<typeof LoginSchema>,
    callbackUrl?: string | null
) => {
    const validatedFields = LoginSchema.safeParse(values);

    if (!validatedFields.success) {
        return {
            error: "Invalid fields!",
        };
    }

    const { email, password, code } = validatedFields.data;

    const existingUser = await getUserByEmail(email);

    if (!existingUser || !existingUser.email || !existingUser.password) {
        return { error: "Invalid credentials!" };
    }

    // Comparing entered password with hashed password
    const isPasswordValid = await bcrypt.compare(
        password,
        existingUser.password
    );
    if (!isPasswordValid) {
        return { error: "Invalid credentials!" };
    }

    // Checking if email is verified
    if (!existingUser.emailVerified) {
        // Generating new Verification Token
        const verificationToken = await generateVerificationToken(
            existingUser.email
        );

        // Re-sending verification email
        await sendVerificationEmail(
            verificationToken.email,
            verificationToken.token,
            existingUser.name ? existingUser.name : "User"
        );

        return { error: "Please verify your email!" };
    }

    // 2FA
    if (existingUser.isTwoFactorEnabled && existingUser.email) {
        if (code) {
            // Verifying 2FA Code
            const twoFactorToken = await getTwoFactorTokenByEmail(
                existingUser.email
            );

            // If there is not 2FA token
            if (!twoFactorToken) {
                return { error: "Invalid code!" };
            }

            // If 2FA token code is not the same as the entered code
            if (twoFactorToken.token !== code) {
                return { error: "Invalid code!" };
            }

            // Checking if 2FA code has expired
            const hasExpired = new Date(twoFactorToken.expires) < new Date();
            if (hasExpired) {
                return { error: "Code has expired!" };
            }

            // Deleting the 2FA Token
            await db.twoFactorToken.delete({
                where: {
                    id: twoFactorToken.id,
                },
            });

            // Checking if there is an existing 2FA Confirmation
            const existing2FAConfirmation =
                await getTwoFactorConfirmationByUserId(existingUser.id);

            // Deleting existing 2FA Confirmation
            if (existing2FAConfirmation) {
                await db.twoFactorConfirmation.delete({
                    where: {
                        id: existing2FAConfirmation.id,
                    },
                });
            }

            // Creating new 2FA Confirmation
            await db.twoFactorConfirmation.create({
                data: {
                    userId: existingUser.id,
                },
            });
        } else {
            // Sending 2FA Code
            const twoFactorToken = await generateTwoFactorToken(
                existingUser.email
            );

            await sendTwoFactorTokenEmail(
                twoFactorToken.email,
                twoFactorToken.token,
                existingUser.name ? existingUser.name : "User"
            );

            return { twoFactor: true };
        }
    }

    try {
        await signIn("credentials", {
            email,
            password,
            // redirectTo: DEFAULT_LOGIN_REDIRECT,
            redirectTo: callbackUrl || DEFAULT_LOGIN_REDIRECT,
        });

        return {
            success: "Login successful!",
        };
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case "CredentialsSignin":
                    return {
                        error: "Invalid credentials!",
                    };
                default:
                    return {
                        error: "Something went wrong!",
                    };
            }
        }
        throw error;
    }
};
