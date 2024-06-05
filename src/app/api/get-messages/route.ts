import dbConnect from "@/lib/Database";
import Usermodel from "@/models/user.model";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  await dbConnect();
  const Session = await getServerSession(authOptions);
  const user = Session?.user;

  if (!Session || !user) {
    return NextResponse.json(
      { error: "User was not Authenticated" },
      { status: 401 }
    );
  }

  const UserId = new mongoose.Types.ObjectId(user._id);

  try {
    const User = await Usermodel.aggregate([
      { $match: { _id: UserId } },
      { $unwind: "$messages" },
      { $sort: { "messages.createdAt": -1 } },
      { $group: { _id: "$_id", messages: { $push: "$messages" } } }
    ]).exec();
    console.log(User);
    

    if (!User || User.length === 0) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      {
        message: "Messages fetched successfully",
        messages: User[0].messages,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in get-messages route: ", error);
    return NextResponse.json({ error: "Something went wrong" });
  }
}
