import Usermodel from "@/models/user.model";
import dbConnect from "@/lib/Database";

export async function POST(request: Request) {
  await dbConnect();
  try {
    const { username, code } = await request.json();

    const decodedUsername = decodeURIComponent(username);

    // Find the user with the username and verifyCode
    const user = await Usermodel.findOne({
      username: decodedUsername,
    });

    if (!user) {
      return Response.json({
        success: false,
        message: "User not found",
        status: 404,
      });
    }

    // check the verifyCode and verifyCodeExpiry
    const isCodeValid = user.verifyCode === code;
    const isCodeNotExpired = user.verifyCodeExpiry > new Date();

    if (isCodeValid && isCodeNotExpired) {
      // Update the user to be verified
      user.isVerified = true;
      await user.save();
      return Response.json({
        success: true,
        message: "User verified successfully",
        status: 200,
      });
    } else if (!isCodeValid) {
      return Response.json({
        success: false,
        message: "Invalid code",
        status: 400,
      });
    } else if (!isCodeNotExpired) {
      return Response.json({
        success: false,
        message: "Code expired",
        status: 400,
      });
    }
  } catch (error) {
    console.error("Error in verifyCode route: ", error);
    return Response.json({
      success: false,
      message: "Internal Server Error",
      status: 500,
    });
  }
}
