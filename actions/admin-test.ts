"use server";

import { currentRole } from "@/utils/server-current-user/currentUser";
import { UserRole } from "@prisma/client";

export const adminTest = async () => {
    const role = await currentRole();

    if (role === UserRole.ADMIN) {
        return { success: "SERVER ACTION: access granted" };
    } else {
        return { error: "SERVER ACTION: access denied" };
    }
};
