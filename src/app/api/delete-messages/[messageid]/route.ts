import dbConnect from "@/lib/Database";
import Usermodel from "@/models/user.model";
import { User, getServerSession } from "next-auth";

import { authOptions } from "../../auth/[...nextauth]/options";

export async function DELETE(request:Request,
    {params}:{params:{messageid:string}})
     {

     await dbConnect();
      try {
        const messageid=params.messageid;
        console.log(messageid);
        
         const sessions=  await getServerSession(authOptions)
         const user:User= sessions?.user as User;
   
          if(!sessions || !user){
              return Response.json(
                  {error: "User was not Authenticated"},
                  {status: 401}
              )
          }
          console.log(sessions);
          
            const deletedMessage=await Usermodel.updateOne(
              {_id: user._id},
              {$pull: {messages: {_id: messageid}}}
           )
           console.log(deletedMessage);
           
  
           if(deletedMessage.modifiedCount===0){
               return Response.json(
                   {error: "Message not found"},
                   {status: 404}
               )
           }
              return Response.json(
                {message: "Message deleted successfully"},
                {status: 200}
              )
      } catch (error) {
        console.error("Error in delete-messages route: ", error)
         return Response.json(
            {error: "Something went wrong"},
            {status: 500}
        )
        
      }
       
     
}


