import Usermodel  from "@/models/user.model"; 
import { userNameValidation } from "@/schemas/signUpSchema";
import dbConnect from "@/lib/Database";
import {z} from "Zod"

const UsernameQuerySchema = z.object({
    username: userNameValidation,
  });


 export  async function GET(request: Request) {
      await dbConnect();
      try {
          // URL EXAMPLE: /api/check-username-unique?username=example

          // extracting search parameters from the request URL
         const{searchParams} = new URL(request.url)
         
           //  Extracting the username from the search parameters
            const queryParams = {
                username:searchParams.get('username')
            }
            // Validate the query parameters
            const result = UsernameQuerySchema.safeParse(queryParams);

            console.log(result);

            if (!result.success) {
                return Response.json({
                    "success": false,
                    "message": result.error.errors,
                    "status": 400
                })
            }
            // Check if the username exists in the database

            const existingVerifieduser= await Usermodel.findOne({
                username: queryParams.username,
                isVerified: true,
              });
              
                if (existingVerifieduser) {
                    return Response.json(
                      {
                        success: false,
                        message: 'Username is already taken',
                      },
                      { status: 200 }
                    );
                  }
                    return Response.json(
                        {
                        success: true,
                        message: 'Username is unique',
                        },
                        { status: 200 }
                    );


      } catch (error) {
        console.error("Username is not a unique value",error)
        return Response.json({
            "success": false,
            "message": "Username is not a unique value",
            "status": 500
        })
      }
 }