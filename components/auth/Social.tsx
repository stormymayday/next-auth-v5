"use client";

import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { Button } from "@/components/ui/Button";
import { signIn } from "next-auth/react";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { useSearchParams } from "next/navigation";

function Social() {
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get("callbackUrl");

    const onClick = (provider: "google" | "github") => {
        signIn(provider, {
            callbackUrl: callbackUrl || DEFAULT_LOGIN_REDIRECT,
        });
    };
    return (
        <div className="w-full flex gap-x-2 items-center justify-center">
            <Button
                variant="outline"
                size="lg"
                className="w-full"
                onClick={() => onClick("google")}
            >
                <FcGoogle />
            </Button>
            <Button
                variant="outline"
                size="lg"
                className="w-full"
                onClick={() => onClick("github")}
            >
                <FaGithub />
            </Button>
        </div>
    );
}
export default Social;
