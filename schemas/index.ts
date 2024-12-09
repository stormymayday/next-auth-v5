import * as z from "zod";

export const LoginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1, {
        message: "Invalid password",
    }),
});

export const RegisterSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8, {
        message: "Password must be at least 8 characters long",
    }),
    name: z.string().min(1, {
        message: "Name is required",
    }),
});

export const ResetPasswordSchema = z.object({
    email: z.string().email({
        message: "Email is required",
    }),
});

const passwordMinLength = 8;
export const NewPasswordSchema = z.object({
    password: z.string().min(passwordMinLength, {
        message: `Password must be at least ${passwordMinLength} characters long`,
    }),
});
