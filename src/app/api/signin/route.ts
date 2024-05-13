import { NextRequest } from "next/server";
import bcrypt from "bcrypt";
import Usermodel  from "@/models/user.model"; 
import { sendVerificationEmail } from "@/helpers/EmailVerification";
import dbConnect from "@/lib/Database";

export async function POST(request: NextRequest) {
    try {
         await dbConnect();
        // Extracting username, email, and password from the request body
        const { username, email, password } = await request.json();

        // Check if a user already exists with the provided username and is verified
        const existingVerifiedUserByUsername = await Usermodel.findOne({ username, isVerified: true });
        
        if (existingVerifiedUserByUsername) {
            // If user already exists with the username and is verified, return an error
            return Response.json({
                success: false,
                message: 'User already exists with this username',
            });
        }

        // Check if a user already exists with the provided email and is verified
       
        const existingVerifiedUserByEmail = await Usermodel.findOne({ email, isVerified: true })
        
        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
        const hashedPassword = await bcrypt.hash(password, 10);

        if (existingVerifiedUserByEmail) {
            if (existingVerifiedUserByEmail.isVerified) {
                return Response.json(
                  {
                    success: false,
                    message: 'User already exists with this email',
                  },
                  { status: 400 }
                );
              }else {
            // If user exists with the email but is not verified, update their information
           
                
                existingVerifiedUserByEmail.password = hashedPassword;
                existingVerifiedUserByEmail.verifyCode = verifyCode;
                existingVerifiedUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);
                await existingVerifiedUserByEmail.save();
        }
        }
             else {
                
           // Hash the password
               const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user instance
        const newUser = new Usermodel({
            username,
            email,
            password: hashedPassword,
            verifyCode,
            verifyCodeExpiry: new Date(Date.now() + 3600000), // Verification code expiry time (1 hour from now)
            isVerified: false,
            isAcceptingMessages: true, 
            messages: [], 
        });

        // Save the new user to the database
        await newUser.save();
            }
      
        

        // Send verification email to the user
        const emailResponse = await sendVerificationEmail(email, username, verifyCode);
        console.log(emailResponse)

        if (!emailResponse.success) {
            // If there's an error sending the verification email, return an error Response
            return Response.json({
                message: 'Error sending verification email',
                success: false,
                status: 500, // Internal Server Error status code
            });
        }
        
        // If everything is successful, return a success Response
        return Response.json({
            message: 'User registered successfully. Please verify your email address.',
            success: true,
            status: 201, // Created status code
        });

    } catch (error) {
        // If any error occurs during registration, log the error and return an error Response
        console.error("Error registering user:", error);

        return Response.json({
            message: 'Error registering user',
            success: false,
        }, {
            status: 500, // Internal Server Error status code
        });
    }
}
