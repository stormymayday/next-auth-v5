"use client";

import { useRouter } from "next/navigation";
import {
    Dialog,
    DialogContent,
    DialogTrigger,
    DialogTitle,
} from "@/components/ui/Dialog";
import LoginForm from "@/components/auth/LoginForm";

interface LoginButtonProps {
    children: React.ReactNode;
    mode?: "modal" | "redirect";
    asChild?: boolean;
}

function LoginButton({
    children,
    mode = "redirect",
    asChild,
}: LoginButtonProps) {
    const router = useRouter();

    const handleClick = () => {
        router.push("/auth/login");
    };

    if (mode === "modal") {
        return (
            <Dialog>
                <DialogTrigger asChild={asChild}>{children}</DialogTrigger>
                <DialogContent className="p-0 w-auto bg-transparent border-none">
                    <DialogTitle className="sr-only">Login</DialogTitle>
                    <LoginForm />
                </DialogContent>
            </Dialog>
        );
    }

    return (
        <span onClick={handleClick} className="cursor-pointer">
            {children}
        </span>
    );
}
export default LoginButton;
