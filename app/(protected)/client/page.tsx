"use client";

import { useCurrentUser } from "@/hooks/useCurrentUser";
import UserInfo from "@/components/UserInfo";

function ClientPage() {
    const user = useCurrentUser();

    return (
        <section className="w-[95vw] max-w-[600px]">
            <UserInfo user={user} label="📱 Client Component" />
        </section>
    );
}

export default ClientPage;
