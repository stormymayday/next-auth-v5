import { v4 as uuidv4 } from "uuid";
import { db } from "@/lib/db";
import { getPasswordResetTokenByEmail } from "@/utils/get-password-reset-tokens/getPasswordResetTokenByEmail";

export const generatePasswordResetToken = async (email: string) => {
    // Generating a token
    const token = uuidv4();

    // Token expires in 1 hour
    const expires = new Date(new Date().getTime() + 3600 * 1000);

    // Checking for an existing token for a given email
    const existingToken = await getPasswordResetTokenByEmail(email);

    // If token exists...
    if (existingToken) {
        // Remove it from the database
        await db.passwordResetToken.delete({
            where: {
                id: existingToken.id,
            },
        });
    }

    // Generating new Password Reset Token
    const passwordResetToken = await db.passwordResetToken.create({
        data: {
            email,
            token,
            expires,
        },
    });

    return passwordResetToken;
};
