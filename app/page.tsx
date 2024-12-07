import { Button } from "@/components/ui/Button";
import LoginButton from "@/components/auth/LoginButton";

// Custom font:
import { Roboto } from "next/font/google";
import { cn } from "@/lib/utils";
const font = Roboto({
    subsets: ["latin"],
    weight: ["700"],
});

export default function Home() {
    return (
        <main className="h-full flex flex-col items-center justify-center">
            <div className="space-y-6 text-center">
                <h1
                    className={cn(
                        "text-6xl font-semibold drop-shadow-md",
                        font.className
                    )}
                >
                    🔐 Next Auth v5
                </h1>
                <div>
                    <LoginButton>
                        <Button size="lg">Begin</Button>
                    </LoginButton>
                </div>
            </div>
        </main>
    );
}
