"use server";

import { signOut } from "@/auth";

export const logout = async () => {
    // Do some server stuff before logging out
    // await signOut({ redirectTo: "/auth/login" });
    await signOut();
};
