import NextAuth, { DefaultSession } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "@/lib/db";
import authConfig from "@/auth.config";
import { getUserById } from "@/utils/get-user/getUserById";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { JWT } from "next-auth/jwt";
import { UserRole } from "@prisma/client";

type ExtendedUser = DefaultSession["user"] & {
    role: UserRole;
    // add extra fields here:
    // newCustomField: string;
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

            // TODO: Add 2FA check

            return true;
        },
        async session({ token, session }) {
            if (token.role && session.user) {
                session.user.role = token.role;
            }

            if (token.sub && session.user) {
                session.user.id = token.sub;
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

            token.role = existingUser.role;

            return token;
        },
    },
    adapter: PrismaAdapter(db),
    session: { strategy: "jwt" },
    ...authConfig,
});
