"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ResetPasswordSchema } from "@/schemas";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/Form";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import CardWrapper from "@/components/auth/CardWrapper";
import FormError from "@/components/FormError";
import FromSuccess from "@/components/FormSuccess";
import { resetPassword } from "@/actions/resetPassword";
import { useState, useTransition } from "react";

function PasswordResetForm() {
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | undefined>("");
    const [success, setSuccess] = useState<string | undefined>("");

    const form = useForm<z.infer<typeof ResetPasswordSchema>>({
        resolver: zodResolver(ResetPasswordSchema),
        defaultValues: {
            email: "",
        },
    });

    function onSubmit(values: z.infer<typeof ResetPasswordSchema>) {
        // Clearing error and success
        setError("");
        setSuccess("");

        // Pending State
        startTransition(async () => {
            try {
                setError("");
                setSuccess("");

                const data: { error?: string; success?: string } =
                    await resetPassword(values);

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
            headerLabel="Forgot your password?"
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
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            // placeholder="john.doe@example.com"
                                            type="email"
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
                        {isPending ? "Sending an email..." : "Send reset email"}
                    </Button>
                </form>
            </Form>
        </CardWrapper>
    );
}

export default PasswordResetForm;
