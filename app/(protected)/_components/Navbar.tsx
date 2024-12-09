"use client";

import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import UserButton from "@/components/auth/UserButton";

function Navbar() {
    const pathname = usePathname();

    return (
        <nav className="bg-secondary flex justify-between items-center p-4 rounded-sm w-[95vw] max-w-[600px] shadow-sm">
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
