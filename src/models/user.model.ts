import mongoose,{Schema,Document} from "mongoose";

// Define interface
export interface  message extends Document{
    content:string;
    createdAt:Date
}
 const messageSchema:Schema<message>=new mongoose.Schema({
    content:{
        type:String,
        required:true,
 },
 createdAt:{
    type: Date,
    required: true,
    default: Date.now,
 }
 })

 //define user Interface
  export interface user extends Document{
    username: string;
    email: string;
    password: string;
    verifyCode: string;
    verifyCodeExpiry: Date; 
    isVerified: boolean;
    isAcceptingMessages: boolean;
    messages: message[];
  }

  // define UserSchema
   const UserSchema:Schema<user>=new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username is required'],
        trim: true,
        unique: true,
      },
      email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        match: [/.+\@.+\..+/, 'Please use a valid email address'],
      },
      password: {
        type: String,
        required: [true, 'Password is required'],
      },
      verifyCode: {
        type: String,
        required: [true, 'Verify Code is required'],
      },
      verifyCodeExpiry: {
        type: Date,
        required: [true, 'Verify Code Expiry is required'],
      },
      isVerified: {
        type: Boolean,
        default: false,
      },
      isAcceptingMessages: {
        type: Boolean,
        default: true,
      },
      messages: [messageSchema],
   })
   const Usermodel=(mongoose.models.users as mongoose.Model<user>)|| mongoose.model<user>('User', UserSchema); 
    export default Usermodel