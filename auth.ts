import NextAuth, { DefaultSession } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "@/lib/db";
import authConfig from "@/auth.config";
import { getUserById } from "@/utils/get-user/getUserById";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { JWT } from "next-auth/jwt";
import { UserRole } from "@prisma/client";
import { getTwoFactorConfirmationByUserId } from "@/utils/get-two-factor-confirmation/getTwoFactorConfirmationByUserId";
import { getAccountByUserId } from "@/utils/get-user-account/getAccountByUserId";

export type ExtendedUser = DefaultSession["user"] & {
    role: UserRole;
    isTwoFactorEnabled: boolean;
    isOAuth: boolean;
    // add extra fields here ...
};

declare module "next-auth" {
    interface Session {
        user: ExtendedUser;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        role?: "ADMIN" | "USER";
    }
}

export const {
    handlers: { GET, POST },
    auth,
    signIn,
    signOut,
} = NextAuth({
    pages: {
        signIn: "/auth/login",
        error: "auth/error",
    },
    events: {
        async linkAccount({ user }) {
            // Automatically verifying an email for Google and GitHub Sign Ins
            await db.user.update({
                where: { id: user.id },
                data: { emailVerified: new Date() },
            });
        },
    },
    callbacks: {
        async signIn({ user, account }) {
            // Allowing OAuth Sign In without email verification
            if (account?.provider !== "credentials") {
                return true;
            }

            if (!user.id) {
                return false;
            }

            // Searing for an existing user
            const existingUser = await getUserById(user.id);

            // Checking if email is verified
            if (!existingUser || !existingUser.emailVerified) {
                // Preventing Sign In if email is not verified
                return false;
            }

            // If 2FA is enabled
            if (existingUser.isTwoFactorEnabled) {
                // Getting 2FA Confirmation by userId
                const twoFactorConfirmation =
                    await getTwoFactorConfirmationByUserId(existingUser.id);

                // Preventing singIn if there is no 2FA Confirmation
                if (!twoFactorConfirmation) {
                    return false;
                }

                // Otherwise,
                // Deleting Two Factor confirmation for next signIn
                await db.twoFactorConfirmation.delete({
                    where: {
                        id: twoFactorConfirmation.id,
                    },
                });

                // Signing in...
            }

            return true;
        },
        async session({ token, session }) {
            if (token.sub && session.user) {
                session.user.id = token.sub;
            }

            if (token.role && session.user) {
                session.user.role = token.role;
            }

            if (session.user) {
                session.user.isTwoFactorEnabled =
                    token.isTwoFactorEnabled as boolean;
            }

            // Updating values
            if (session.user) {
                session.user.name = token.name;
                session.user.email = token.email || "";
                session.user.isOAuth = token.isOAuth as boolean;
            }

            return session;
        },
        async jwt({ token }) {
            if (!token.sub) {
                return token;
            }

            const existingUser = await getUserById(token.sub);

            if (!existingUser) {
                return token;
            }

            const existingAccount = await getAccountByUserId(existingUser.id);

            token.isOAuth = !!existingAccount;
            token.name = existingUser.name;
            token.email = existingUser.email;
            token.role = existingUser.role;
            token.isTwoFactorEnabled = existingUser.isTwoFactorEnabled;

            return token;
        },
    },
    adapter: PrismaAdapter(db),
    session: { strategy: "jwt" },
    ...authConfig,
});
