import { db } from "@/lib/db";

export const getVerificationTokenByEmail = async (email: string) => {
    try {
        const verificationToken = await db.emailVerificationToken.findFirst({
            where: {
                email,
            },
        });

        return verificationToken;
    } catch {
        return null;
    }
};
