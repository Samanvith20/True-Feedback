import { User, getServerSession } from "next-auth";
import Usermodel from "@/models/user.model";
import dbConnect from "@/lib/Database";

import { authOptions } from "../auth/[...nextauth]/options";

 export async function POST(request:Request){
      await dbConnect();
       try {
             // Get the user from the session
             const Session=  await getServerSession(authOptions)
              
             // Check if the user is authenticated
             const user:User=Session?.user

             if(!Session || !user){
                 return Response.json(
                    {error: "User was not Authenticated"},
                    {status: 401}
                )
             }
              const UserId= user._id
              const{acceptMessages}=await request.json()
                const userToUpdate= await Usermodel.findById(UserId,
                    {isAcceptingMessages:acceptMessages},
                   {new :true})

                   if(!userToUpdate){
                       return Response.json(
                           {error: "User not found"},
                           {status: 404}
                       )

                   }
                      return Response.json(
                        {
                            message: "User updated successfully",
                            userToUpdate
                        },
                        {status: 200}
                    )

       } catch (error) {
         console.error("Error in get-messages route: ", error)
          return Response.json({error: "Something went wrong"})
       }

    }

    //  the GET method is used to fetch the current isAcceptingMessages status of a user.
     export async function GET(request:Request){
        await dbConnect();
         try {
                 // Get the user from the session
                 const Session=  await getServerSession(authOptions)
                
                 // Check if the user is authenticated
                 const user:User=Session?.user
    
                 if(!Session || !user){
                     return Response.json(
                        {error: "User was not Authenticated"},
                        {status: 401}
                    )
                 }
                const UserId= user._id
                const userFound= await Usermodel.findById(UserId)
    
                     if(!userFound){
                         return Response.json(
                             {error: "User not found"},
                             {status: 404}
                         )
    
                     }
                        return Response.json(
                            {
                                message: "User found",
                                isAcceptingMessages: userFound.isAcceptingMessages
                            },
                            {status: 200}
                        )
    
         } catch (error) {
             console.error("Error in get-messages route: ", error)
            return Response.json({error: "Something went wrong"})
         }
     }