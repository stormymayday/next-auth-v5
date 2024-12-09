"use client";

import { useCurrentUser } from "@/hooks/useCurrentUser";
import UserInfo from "@/components/UserInfo";

function ClientPage() {
    const user = useCurrentUser();

    return (
        <section
            className="mt-5 bg-slate-50 p-4 rounded-sm shadow-sm h-[80vh] flex items-center justify-center"
            style={{ minHeight: "calc(100vh - 7.7rem)" }}
        >
            <article className="w-[90vw] max-w-[600px]">
                <UserInfo user={user} label="📱 Client Component" />
            </article>
        </section>
    );
}

export default ClientPage;
