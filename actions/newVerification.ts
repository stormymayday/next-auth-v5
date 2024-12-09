"use server";

import { db } from "@/lib/db";
import { getUserByEmail } from "@/utils/get-user/getUserByEmail";
import { getVerificationTokenByToken } from "@/utils/get-verification-tokens/getVerificationTokenByToken";

export const newVerification = async (token: string) => {
    // Fetching existing token from db
    const existingToken = await getVerificationTokenByToken(token);

    // Checking if token exists
    if (!existingToken) {
        return {
            error: "Token does not exist",
        };
    }

    // Checking if token has expired
    const tokenExpired = new Date(existingToken.expires) < new Date();
    if (tokenExpired) {
        return { error: "Token has expired" };
    }

    // Fetching an existing user
    const existingUser = await getUserByEmail(existingToken.email);

    // Checking if the user exists
    if (!existingUser) {
        return { error: "Email does not exist" };
    }

    // Updating the user
    // Setting emailVerified to current date and email to the email from token
    await db.user.update({
        where: { id: existingUser.id },
        data: { emailVerified: new Date(), email: existingToken.email },
    });

    // Deleting existing token
    await db.emailVerificationToken.delete({
        where: {
            id: existingToken.id,
        },
    });

    return { success: "Email verified!" };
};
