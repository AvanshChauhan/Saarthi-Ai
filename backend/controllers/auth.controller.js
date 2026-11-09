import { app } from "../config/firebase.js";
import { getAuth } from "firebase-admin/auth";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { getTokenUsage } from "../utils/tokenUsage.js";

const toPublicUser = (user) => {
  const publicUser = user.toObject();
  delete publicUser.tokenUsageMonth;
  delete publicUser.tokensUsed;
  return {
    ...publicUser,
    tokenUsage: getTokenUsage(user),
  };
};

export const login = async (req, res) => {
  try {
    if (!process.env.JWT_SECRET) {
      return res.status(500).json({
        message: "Server authentication is not configured",
        success: false,
      });
    }

    const { FireBaseToken } = req.body;
    if (!FireBaseToken) {
      return res.status(400).json({
        message: "FireBaseToken not found",
        success: false,
      });
    }
    let decoded;
    try {
      decoded = await getAuth(app).verifyIdToken(FireBaseToken);
    } catch {
      return res.status(401).json({
        message: "invalid token",
        success: false,
      });
    }

    const user = await User.findOneAndUpdate(
      { firebaseUID: decoded.uid },
      {
        $set: {
          username: decoded.name,
          email: decoded.email,
          profilePicture: decoded.picture,
        },
        $setOnInsert: {
          firebaseUID: decoded.uid,
        },
      },
      { upsert: true, returnDocument: "after" },
    );
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return res.status(200).json({
      message: "login successful",
      success: true,
      user: toPublicUser(user),
    });
  } catch (error) {
    console.error("Login failed:", error);
    return res.status(500).json({
      message: "Login could not be completed. Check the backend configuration and database connection.",
      success: false,
    });
  }
};
export const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      secure: false,
      sameSite: "strict",
    });
    return res.status(200).json({
      message: "User logged out",
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: "login failed",
      success: false,
    });
  }
};
export const me=async (req,res)=>{
  try {
    const user=req.user
    return res.status(200).json(toPublicUser(user))
  } catch (error) {
    return res.status(500).json({
      message:"the user doesn't exist",
      success:false
    })
  }
}
