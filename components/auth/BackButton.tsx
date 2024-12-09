"use client";

import { Button } from "@/components/ui/Button";
import Link from "next/link";

interface BackButtonProps {
    label: string;
    href: string;
}

function BackButton({ label, href }: BackButtonProps) {
    return (
        <Button variant="link" size="sm" className="font-normal w-full" asChild>
            <Link href={href}>{label}</Link>
        </Button>
    );
}
export default BackButton;
