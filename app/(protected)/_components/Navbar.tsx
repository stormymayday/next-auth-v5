"use client";

import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import UserButton from "@/components/auth/UserButton";

function Navbar() {
    const pathname = usePathname();

    return (
        <nav className="w-full max-w-[600px] mt-5 bg-slate-50 h-auto min-h-16 flex flex-col sm:flex-row justify-between items-center p-4 rounded-sm shadow-sm space-y-4 sm:space-y-0">
            <div className="flex gap-x-2">
                <Button
                    variant={pathname === "/server" ? "default" : "outline"}
                    asChild
                >
                    <Link href="/server">Server</Link>
                </Button>
                <Button
                    variant={pathname === "/client" ? "default" : "outline"}
                    asChild
                >
                    <Link href="/client">Client</Link>
                </Button>
                <Button
                    variant={pathname === "/admin" ? "default" : "outline"}
                    asChild
                >
                    <Link href="/admin">Admin</Link>
                </Button>
                <Button
                    variant={pathname === "/settings" ? "default" : "outline"}
                    asChild
                >
                    <Link href="/settings">Settings</Link>
                </Button>
            </div>
            <UserButton />
        </nav>
    );
}
export default Navbar;
