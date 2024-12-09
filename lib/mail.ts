import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendVerificationEmail = async (
    email: string,
    token: string,
    name: string
) => {
    // Generating a confirmation link
    const confirmationLink = `${process.env.APP_URL}/auth/new-verification?token=${token}`;

    // Sending the email
    await resend.emails.send({
        from: `Next Auth V5 <mail@graffixapp.com>`,
        to: email,
        subject: "Verify your email",
        html: `<p>Hello ${name}! Click <a href="${confirmationLink}">here</a> to verify your email</p>`,
    });
};

export const sendPasswordResetEmail = async (
    email: string,
    token: string,
    name: string
) => {
    // Generating a password reset link
    const passwordResetLink = `${process.env.APP_URL}/auth/new-password?token=${token}`;

    // Sending the email
    await resend.emails.send({
        from: `Next Auth V5 <mail@graffixapp.com>`,
        to: email,
        subject: "Reset your password for Next Auth V5",
        html: `<p>Hello ${name}! Click <a href="${passwordResetLink}">here</a> to reset your password</p>`,
    });
};

export const sendTwoFactorTokenEmail = async (
    email: string,
    token: string,
    name: string
) => {
    // Sending the email
    await resend.emails.send({
        from: `Next Auth V5 <mail@graffixapp.com>`,
        to: email,
        subject: "2FA Code",
        html: `<p>Hello ${name}! Your 2FA code is ${token}</p>`,
    });
};
