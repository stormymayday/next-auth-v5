"use server";

import * as z from "zod";
import { ResetPasswordSchema } from "@/schemas";
import { getUserByEmail } from "@/utils/get-user/getUserByEmail";
import { generatePasswordResetToken } from "@/utils/generate-tokens/generatePasswordResetToken";
import { sendPasswordResetEmail } from "@/lib/mail";

export const resetPassword = async (
    values: z.infer<typeof ResetPasswordSchema>
) => {
    // Validating the fields
    const validatedFields = ResetPasswordSchema.safeParse(values);

    if (!validatedFields.success) {
        return { error: "Invalid email!" };
    }

    // Extracting the email
    const { email } = validatedFields.data;

    // Fetching a user by email
    const existingUser = await getUserByEmail(email);

    // If there is no user ...
    if (!existingUser) {
        return { error: "Invalid email" };
    }

    // Generating password reset token
    const passwordResetToken = await generatePasswordResetToken(email);

    //  Sending an email
    await sendPasswordResetEmail(
        passwordResetToken.email,
        passwordResetToken.token,
        existingUser.name ? existingUser.name : "User"
    );

    return { success: "Reset email sent!" };
};
