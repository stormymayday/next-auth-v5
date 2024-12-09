"use client";

import { useCurrentUser } from "@/hooks/useCurrentUser";

function SettingsPage() {
    const user = useCurrentUser();

    return (
        <section
            className="mt-5 bg-slate-50 p-4 rounded-sm shadow-sm h-[80vh]"
            style={{ minHeight: "calc(100vh - 7.7rem)" }}
        >
            <pre className="whitespace-pre-wrap break-words">
                {JSON.stringify(user)}
            </pre>
        </section>
    );
}
export default SettingsPage;
