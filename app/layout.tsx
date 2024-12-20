import type { Metadata } from "next";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";
import { Toaster } from "@/components/ui/Sonner";

export const metadata: Metadata = {
    title: "Next Auth V5",
    description: "Generated by create next app",
};

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const session = await auth();

    return (
        <SessionProvider session={session}>
            <html lang="en">
                <body>
                    <Toaster />
                    {children}
                </body>
            </html>
        </SessionProvider>
    );
}
