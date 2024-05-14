
import { ApiResponse } from "@/types/ApiResponse";

import { resend } from "@/lib/resendEmail";
import VerificationEmail from "./verifyEmail";

export  const sendVerificationEmail = async (email: string, username: string, otp: string): Promise<ApiResponse> => {
   try {
    await resend.emails.send({
      from: 'yervala@gmail.com',
      to: email,
      subject: 'Mystery Message Verification Code',
      react: VerificationEmail({ username, otp: otp }),
    })
    return { success: true, message: 'Verification email sent successfully.' };
   } catch (emailError) {
    console.error('Error sending verification email:', emailError);
    return { success: false, message: 'Failed to send verification email.' };
   }
}