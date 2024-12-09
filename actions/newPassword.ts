"use server";

import { db } from "@/lib/db";
// import { redirect } from "next/navigation";
// import { revalidatePath } from "next/cache";
// import { AuthError } from "next-auth";
import * as z from "zod";
import {
    // LoginSchema,
    // RegisterSchema,
    // ResetPasswordSchema,
    NewPasswordSchema,
} from "@/schemas";
import bcrypt from "bcryptjs";
import { getUserByEmail } from "@/utils/get-user/getUserByEmail";
// import { signIn } from "@/auth";
// import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
// import {
//     generateVerificationToken,
//     generatePasswordResetToken,
// } from "@/utils/tokens";
// import { getVerificationTokenByToken } from "@/utils/verification-token";
// import { sendVerificationEmail, sendPasswordResetEmail } from "@/utils/mail";
import { getPasswordResetTokenByToken } from "@/utils/get-password-reset-tokens/getPasswordResetTokenByToken";

export const newPassword = async (
    values: z.infer<typeof NewPasswordSchema>,
    token: string | null
) => {
    if (!token) {
        return { error: "Missing token!" };
    }

    // Validating fields
    const validatedFields = NewPasswordSchema.safeParse(values);

    if (!validatedFields.success) {
        return { error: "Invalid password!" };
    }

    // Extracting the password
    const { password } = validatedFields.data;

    // Token validation
    const existingToken = await getPasswordResetTokenByToken(token);

    if (!existingToken) {
        return { error: "Invalid token!" };
    }

    // Checking if token has expired
    const expiredToken = new Date(existingToken.expires) < new Date();
    if (expiredToken) {
        return { error: "Token has expired!" };
    }

    // Checking existing user
    const existingUser = await getUserByEmail(existingToken.email);
    if (!existingUser) {
        return { error: "Email does not exist!" };
    }

    // Hashing the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Updating the user
    await db.user.update({
        where: {
            id: existingUser.id,
        },
        data: {
            password: hashedPassword,
        },
    });

    // Deleting the reset token
    await db.passwordResetToken.delete({
        where: {
            id: existingToken.id,
        },
    });

    return { success: "Password updated!" };
};
