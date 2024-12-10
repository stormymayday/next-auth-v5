"use client";

import CardWrapper from "@/components/auth/CardWrapper";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema } from "@/schemas";
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
import { PasswordInput } from "@/components/ui/PasswordInput";
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "@/components/ui/OTPInput";
import FormError from "@/components/FormError";
import FromSuccess from "@/components/FormSuccess";
import { login } from "@/actions/login";
import { useState, useTransition } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

function LoginForm() {
    const searchParams = useSearchParams();

    const callbackUrl = searchParams.get("callbackUrl");

    const urlError =
        searchParams.get("error") === "OAuthAccountNotLinked"
            ? "Email already in use with different provider!"
            : "";

    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | undefined>("");
    const [success, setSuccess] = useState<string | undefined>("");
    const [showTwoFactor, setShowTwoFactor] = useState(false);

    const form = useForm<z.infer<typeof LoginSchema>>({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    async function onSubmit(values: z.infer<typeof LoginSchema>) {
        // Reset all state variables at the start of submission
        setError("");
        setSuccess("");

        // Determine whether to reset two-factor state
        const shouldResetTwoFactor = !values.code;

        startTransition(async () => {
            try {
                // Log the input values for debugging (sanitized)
                // console.log("Login Attempt", {
                //     email: values.email.substring(0, 3) + "***",
                //     hasPassword: !!values.password,
                //     hasCode: !!values.code,
                // });

                // Explicitly typing the login function's return
                const data: {
                    error?: string;
                    success?: string;
                    twoFactor?: boolean;
                    redirect?: string;
                } | null = await login(values, callbackUrl);

                // null and undefined checks
                if (!data) {
                    setError("No response received from server");
                    console.error("Login returned null or undefined");
                    return;
                }

                // Handling redirect explicitly
                if (data.redirect) {
                    // console.log("Redirecting to:", data.redirect);
                    window.location.href = data.redirect;
                    return;
                }

                // Error handling
                if (data.error) {
                    // 2FA specific
                    if (showTwoFactor && values.code) {
                        form.setValue("code", "");
                        setError("Invalid two-factor authentication code");
                        return;
                    }

                    // Handling other login errors
                    setError(data.error);
                    return;
                }

                // Successful login
                if (data.success) {
                    form.reset();
                    setSuccess(data.success);

                    // Resetting two-factor state
                    if (shouldResetTwoFactor) {
                        setShowTwoFactor(false);
                    }
                    return;
                }

                // Triggering two-factor authentication
                if (data.twoFactor) {
                    setShowTwoFactor(true);
                }
            } catch (error) {
                // Handling Next.js redirect error
                if (
                    error instanceof Error &&
                    error.message === "NEXT_REDIRECT"
                ) {
                    // console.log("Redirect caught:", error);
                    return;
                }

                // Detailed error logging with type checking
                if (error instanceof Error) {
                    // console.error("Detailed Error:", {
                    //     name: error.name,
                    //     message: error.message,
                    //     stack: error.stack,
                    // });

                    // More specific error handling
                    setError(
                        error.message || "An unexpected login error occurred"
                    );
                } else {
                    console.error("Unknown error type:", error);
                    setError("An unexpected login error occurred");
                }
            }
        });
    }

    return (
        <CardWrapper
            headerLabel="Welcome back"
            backButtonLabel="Don't have an account?"
            backButtonHref="/auth/register"
            showSocial
        >
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6"
                >
                    <div className="space-y-4">
                        {showTwoFactor && (
                            <div className="flex justify-center text-center">
                                <FormField
                                    control={form.control}
                                    name="code"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Two Factor Code
                                            </FormLabel>
                                            <FormControl>
                                                <InputOTP
                                                    maxLength={6}
                                                    value={field.value || ""}
                                                    onChange={field.onChange}
                                                    disabled={isPending}
                                                >
                                                    <InputOTPGroup>
                                                        {[...Array(6)].map(
                                                            (_, index) => (
                                                                <InputOTPSlot
                                                                    key={index}
                                                                    index={
                                                                        index
                                                                    }
                                                                />
                                                            )
                                                        )}
                                                    </InputOTPGroup>
                                                </InputOTP>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        )}
                        {!showTwoFactor && (
                            <>
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    type="email"
                                                    maxLength={50}
                                                    disabled={isPending}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Password</FormLabel>
                                            <FormControl>
                                                <PasswordInput
                                                    {...field}
                                                    maxLength={30}
                                                    disabled={isPending}
                                                />
                                            </FormControl>
                                            <Button
                                                size="sm"
                                                variant="link"
                                                asChild
                                                className="px-0 font-normal"
                                            >
                                                <Link href="/auth/reset">
                                                    Forgot password?
                                                </Link>
                                            </Button>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </>
                        )}
                    </div>
                    <FormError message={error || urlError} />
                    <FromSuccess message={success} />
                    <Button
                        type="submit"
                        className="min-w-full"
                        disabled={isPending}
                    >
                        {showTwoFactor
                            ? isPending
                                ? "Confirming..."
                                : "Confirm"
                            : isPending
                            ? "Logging in..."
                            : "Login"}
                    </Button>
                </form>
            </Form>
        </CardWrapper>
    );
}
export default LoginForm;
