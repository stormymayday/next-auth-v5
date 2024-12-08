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
} from "@/components/shadcn-ui/Form";
import { Input } from "@/components/shadcn-ui/Input";
import { Button } from "@/components/shadcn-ui/Button";
import { PasswordInput } from "@/components/shadcn-ui/PasswordInput";
import FormError from "@/components/FormError";
import FromSuccess from "@/components/FormSuccess";
import { login } from "@/actions/login";
import { useState, useTransition } from "react";

function LoginForm() {
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | undefined>("");
    const [success, setSuccess] = useState<string | undefined>("");

    const form = useForm<z.infer<typeof LoginSchema>>({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    function onSubmit(values: z.infer<typeof LoginSchema>) {
        setError("");
        setSuccess("");

        startTransition(async () => {
            try {
                setError("");
                setSuccess("");

                const data: { error?: string; success?: string } = await login(
                    values
                );

                setError(data?.error ?? "");
                setSuccess(data?.success ?? "");

                // eslint-disable-next-line @typescript-eslint/no-unused-vars
            } catch (error) {
                setError("Something went wrong!");
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
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <FormError message={error} />
                    <FromSuccess message={success} />
                    <Button
                        type="submit"
                        className="min-w-full"
                        disabled={isPending}
                    >
                        {isPending ? "Logging in..." : "Login"}
                    </Button>
                </form>
            </Form>
        </CardWrapper>
    );
}
export default LoginForm;
