import crypto from "crypto";
import { db } from "@/lib/db";
import { getTwoFactorTokenByEmail } from "@/utils/get-two-factor-tokens/getTwoFactorTokenByEmail";

export const generateTwoFactorToken = async (email: string) => {
    // Generating a token (a random 6-digit number between 100,000 and 999,999)
    const token = crypto.randomInt(100_000, 1_000_000).toString();

    // Token expires in 2 minutes
    const expires = new Date(new Date().getTime() + 2 * 60 * 1000);

    // Checking for an existing token for a given email
    const existingToken = await getTwoFactorTokenByEmail(email);

    // If token exists...
    if (existingToken) {
        // Remove it from the database
        await db.twoFactorToken.delete({
            where: {
                id: existingToken.id,
            },
        });
    }

    // Generating new 2FA Token
    const twoFactorToken = await db.twoFactorToken.create({
        data: {
            email,
            token,
            expires,
        },
    });

    return twoFactorToken;
};
