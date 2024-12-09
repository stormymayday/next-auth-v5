"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { NewPasswordSchema } from "@/schemas/";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/Form";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { Button } from "@/components/ui/Button";
import CardWrapper from "@/components/auth/CardWrapper";
import FormError from "@/components/FormError";
import FromSuccess from "@/components/FormSuccess";
import { newPassword } from "@/actions/newPassword";
import { useState, useTransition } from "react";
import { useSearchParams } from "next/navigation";

function NewPasswordForm() {
    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | undefined>("");
    const [success, setSuccess] = useState<string | undefined>("");

    const form = useForm<z.infer<typeof NewPasswordSchema>>({
        resolver: zodResolver(NewPasswordSchema),
        defaultValues: {
            password: "",
        },
    });

    function onSubmit(values: z.infer<typeof NewPasswordSchema>) {
        // Clearing error and success
        setError("");
        setSuccess("");

        // Pending State
        startTransition(async () => {
            try {
                setError("");
                setSuccess("");

                const data: { error?: string; success?: string } =
                    await newPassword(values, token);

                setError(data?.error ?? "");
                setSuccess(data?.success ?? "");
            } catch (error) {
                const errorMsg =
                    error instanceof Error
                        ? error.message
                        : "Something went wrong!";
                setError(errorMsg);
            }
        });
    }

    return (
        <CardWrapper
            headerLabel="Enter a new password"
            backButtonLabel="Back to login"
            backButtonHref="/auth/login"
        >
            <Form {...form}>
                <form
                    className="space-y-6"
                    onSubmit={form.handleSubmit(onSubmit)}
                >
                    <div className="space-y-4">
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <PasswordInput
                                            {...field}
                                            maxLength={50}
                                            disabled={isPending}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <FormError message={error} />
                    <FromSuccess message={success} />
                    <Button
                        className="min-w-full"
                        type="submit"
                        disabled={isPending}
                    >
                        {isPending ? "Resetting password..." : "Reset password"}
                    </Button>
                </form>
            </Form>
        </CardWrapper>
    );
}

export default NewPasswordForm;
