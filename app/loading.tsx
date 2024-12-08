"use client";

import { BeatLoader } from "react-spinners";

function LoadingPage() {
    return (
        <section className="h-[100vh] flex items-center justify-center">
            <BeatLoader />
        </section>
    );
}
export default LoadingPage;
