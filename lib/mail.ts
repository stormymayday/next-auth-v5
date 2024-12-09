import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendVerificationEmail = async (
    email: string,
    token: string,
    name: string
) => {
    // Generating a confirmation link which is sent to the user
    const confirmationLink = `${process.env.APP_URL}/auth/new-verification?token=${token}`;

    // Sending the email
    await resend.emails.send({
        from: `Next Auth V5 <mail@graffixapp.com>`,
        to: email,
        subject: "Verify your email",
        html: `<p>Hello ${name}! Click <a href="${confirmationLink}">here</a> to verify your email</p>`,
    });
};
