import Navbar from "@/app/(protected)/_components/Navbar";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";

async function ProtectedLayout({ children }: { children: React.ReactNode }) {
    const session = await auth();
    return (
        <SessionProvider session={session}>
            {/* <main className="bg-slate-200 h-full w-full flex justify-center">
                <div className="w-[95vw] max-w-[95vw] flex flex-col gap-y-6 items-center">
                    <Navbar />
                    {children}
                </div>
            </main> */}
            <main className="bg-slate-200 h-screen w-full flex justify-center overflow-hidden">
                <div className="w-[95vw] max-w-[95vw] flex flex-col gap-y-6 items-center overflow-auto">
                    <Navbar />
                    {children}
                </div>
            </main>
        </SessionProvider>
    );
}
export default ProtectedLayout;
