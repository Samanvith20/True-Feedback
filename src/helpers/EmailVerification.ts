import { ApiResponse } from "@/types/ApiResponse";
import { resend } from "@/lib/resendEmail";
import VerificationEmail from "./verifyEmail";

export const sendVerificationEmail = async (email: string, username: string, otp: string): Promise<ApiResponse> => {
  try {
    console.log(`Sending email to ${email} with OTP: ${otp}`);
    const response = await resend.emails.send({
      from: 'Acme <onboarding@resend.dev>',

      to: email,
      subject: 'True feedback Verification Code',
      react: VerificationEmail({ username, otp }),
    });
    console.log('Email sent response:', response);
    return { success: true, message: 'Verification email sent successfully.' };
  } catch (emailError) {
    console.error('Error sending verification email:', emailError);
    return { success: false, message: 'Failed to send verification email.' };
  }
}
