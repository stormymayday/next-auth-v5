"use client";

import { logout } from "@/actions/logout";

interface LogoutButtonProps {
    children?: React.ReactNode;
}

function LogoutButton({ children }: LogoutButtonProps) {
    return (
        <span className="cursor-pointer" onClick={() => logout()}>
            {children}
        </span>
    );
}
export default LogoutButton;
