"use client";

import {
    Card,
    CardHeader,
    CardContent,
    CardFooter,
} from "@/components/ui/Card";
import Header from "@/components/auth/Header";
import Social from "@/components/auth/Social";
import BackButton from "@/components/auth/BackButton";

interface CardWrapperProps {
    children: React.ReactNode;
    headerLabel: string;
    backButtonLabel: string;
    backButtonHref: string;
    showSocial?: boolean;
}

function CardWrapper({
    children,
    headerLabel,
    backButtonLabel,
    backButtonHref,
    showSocial,
}: CardWrapperProps) {
    return (
        // <Card className="w-[400px] shadow-md">
        <Card className="w-[90vw] max-w-[400px] mx-auto shadow-md">
            <CardHeader>
                <Header label={headerLabel} />
            </CardHeader>
            <CardContent>{children}</CardContent>
            {showSocial && (
                <CardFooter>
                    <Social />
                </CardFooter>
            )}
            <CardFooter>
                <BackButton label={backButtonLabel} href={backButtonHref} />
            </CardFooter>
        </Card>
    );
}
export default CardWrapper;
