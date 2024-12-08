import { db } from "@/lib/db";

export async function getUserByEmail(email: string) {
    try {
        const user = await db.user.findUnique({
            where: {
                email: email || undefined,
            },
        });

        return user;
    } catch {
        return null;
    }
}
