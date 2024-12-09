import Navbar from "@/app/(protected)/_components/Navbar";

function ProtectedLayout({ children }: { children: React.ReactNode }) {
    return (
        <main className="bg-slate-200 h-full w-full flex justify-center">
            <div className="w-[95vw] max-w-[95vw]">
                <Navbar />
                {children}
            </div>
        </main>
    );
}
export default ProtectedLayout;
