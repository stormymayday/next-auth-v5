import * as z from "zod";
import { UserRole } from "@prisma/client";

export const LoginSchema = z.object({
    email: z.string().email({
        message: "Invalid email",
    }),
    password: z.string().min(1, {
        message: "Invalid password",
    }),
    code: z.optional(z.string()),
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

export const SettingsSchema = z
    .object({
        name: z.optional(z.string()),
        email: z.optional(z.string().email()),
        password: z.optional(
            z.string().min(8, {
                message: "Password must be at least 8 characters long",
            })
        ),
        newPassword: z.optional(
            z.string().min(8, {
                message: "Password must be at least 8 characters long",
            })
        ),
        isTwoFactorEnabled: z.optional(z.boolean()),
        // role: z.enum([UserRole.ADMIN, UserRole.USER]),
        role: z.nativeEnum(UserRole).optional(),
    })
    .refine(
        (data) => {
            if (data.password && !data.newPassword) {
                return false;
            }

            return true;
        },
        {
            message: "New password is required",
            path: ["newPassword"],
        }
    )
    .refine(
        (data) => {
            if (data.newPassword && !data.password) {
                return false;
            }
            return true;
        },
        {
            message: "Password is required",
            path: ["password"],
        }
    );
