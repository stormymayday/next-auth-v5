"use client";

import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { Button } from "@/components/shadcn-ui/Button";

function Social() {
    return (
        <div className="w-full flex gap-x-2 items-center justify-center">
            <Button
                variant="outline"
                size="lg"
                className="w-full"
                onClick={() => {}}
            >
                <FcGoogle />
            </Button>
            <Button
                variant="outline"
                size="lg"
                className="w-full"
                onClick={() => {}}
            >
                <FaGithub />
            </Button>
        </div>
    );
}
export default Social;
