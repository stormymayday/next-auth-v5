import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";

export async function getUserByEmail(email: string) {
    try {
        const user = await db.user.findUnique({
            where: {
                email: email,
            } as Prisma.UserWhereUniqueInput,
        });

        return user;
    } catch {
        return null;
    }
}
