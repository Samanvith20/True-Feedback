import { message } from "@/models/user.model";

export interface ApiResponse{
  success:boolean,
  message:string,
  isAcceptingMessages?: boolean;
  messages?: Array<message>
}