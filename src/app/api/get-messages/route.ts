import dbConnect from "@/lib/Database";
import Usermodel from "@/models/user.model";
import { request } from "http";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import mongoose from "mongoose";

export async function POST(request:Request){
      await dbConnect();
          const Session=await getServerSession(authOptions)
            const user=Session?.user

            if(!Session || !user){
                return Response.json(
                    {error: "User was not Authenticated"},
                    {status: 401}
                )
            }
            //
            const UserId= new mongoose.Types.ObjectId(user._id)

       try {
          const User= await Usermodel.aggregate([
              {$match: {_id: UserId}},
              {$unwind: "$messages"},
              {$sort: {"messages.createdAt": -1}},
              {$group: {_id: "$_id", messages: {$push: "$messages"}}}
          ]).exec()
           
          if(!User||User.length===0){
              return Response.json(
                  {error: "User not found"},
                  {status: 404}
              )
          }
            return Response.json(
                {
                    message: "Messages fetched successfully",
                    User
                },
                {status: 200}
            )
        
        
       } catch (error) {
         console.error("Error in get-messages route: ", error)
          return Response.json({error: "Something went wrong"})
       }
}