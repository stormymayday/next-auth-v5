"use client";

import CardWrapper from "@/components/auth/CardWrapper";
import { BeatLoader } from "react-spinners";
import FormError from "@/components/FormError";
import FormSuccess from "@/components/FormSuccess";
import { useSearchParams } from "next/navigation";
import { newVerification } from "@/actions/newVerification";
import { useState, useCallback, useEffect } from "react";

function NewVerificationForm() {
    const [error, setError] = useState<string | undefined>();
    const [success, setSuccess] = useState<string | undefined>();

    const searchParams = useSearchParams();

    const token = searchParams.get("token");

    const onSubmit = useCallback(async () => {
        try {
            if (!token) {
                setError("Missing token");
                return;
            }

            const data = await newVerification(token);
            setSuccess(data.success);
            setError(data.error);
        } catch (error) {
            const errorMsg =
                error instanceof Error
                    ? error.message
                    : "Something went wrong!";
            setError(errorMsg);
        }
    }, [token]);

    useEffect(() => {
        onSubmit();
    }, [onSubmit]);

    return (
        <CardWrapper
            headerLabel="Confirming your verification"
            backButtonLabel="Back to login"
            backButtonHref="/auth/login"
        >
            <div className="flex items-center justify-center">
                {!success && !error && <BeatLoader />}

                <FormSuccess message={success} />

                {!success && <FormError message={error} />}
            </div>
        </CardWrapper>
    );
}
export default NewVerificationForm;
