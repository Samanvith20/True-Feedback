import { Message } from "@/models/user.model";

export interface ApiResponse{
  success:boolean,
  message:string,
  isAcceptingMessages?: boolean;
  messages?: Array<Message>
}
interface message {
  _id: string;
  // other properties...
}
