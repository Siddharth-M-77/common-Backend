import bcrypt from "bcrypt";
import { User } from "../models/ecommerce/user.model.js";
import jwt from "jsonwebtoken";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import uploadOnCloudinary from "../middlewares/cloudinary.js";
import ApiResponse from "../utils/ApiResponse.js";

export const userRegistration = async (req, res) => {
  try {
    const { fullName, username, email, password } = req.body;

    if ([username, email, password].some((field) => field?.trim() === "")) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ $or: [{ username }, { email }] });
    if (user) {
      return res.status(409).json({
        message:
          "User is already registered with this email or username. Please try another email.",
      });
    }

    // console.log("REQUEST FILE :", req.files.avatar[0].path);

    const avatarLocalPath = req.files?.avatar[0].path;
    const coverImageLocalPath = req.files?.coverImage[0].path;
    console.log(coverImageLocalPath);

    if (!avatarLocalPath) {
      return res.status(400).json({ message: "Avatar file is required" });
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);

    if (!avatar) {
      return res.status(400).json({ message: "Failed to upload avatar" });
    }

    const createdUser = await User.create({
      fullName,
      email,
      avatar: avatar.secure_url, // Correctly referencing secure_url for avatar
      coverImage: coverImage?.secure_url || "", // Corrected typo: `secure_url` instead of `ulr`
      password: await bcrypt.hash(password, 10),
      username: username.toLowerCase(),
    });

    const newUser = await User.findOne(createdUser._id).select(
      "-password -refreshToken",
    );
    if (!newUser) {
      // Delete the uploaded files from Cloudinary if user creation fails
      await cloudinary.uploader.destroy(avatar.public_id);
      if (coverImage) await cloudinary.uploader.destroy(coverImage.public_id);

      return res
        .status(500)
        .json({ message: "Something went wrong while registering the user" });
    }

    return res
      .status(201)
      .json(new ApiResponse(201, newUser, "User registered successfully"));
  } catch (error) {
    console.error("Registration Error:", error);
    return res.status(500).json({ message: "An unexpected error occurred" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All feild are requird" });
    }
    const existingUser = await User.findOne({ email }).select("-password");

    if (!existingUser) {
      return res.json({
        message: "This email is not registerd!! Please register First..",
      });
    }
    const userWithPassword = await User.findOne({ email });
    const passwordMatch = await bcrypt.compare(
      password,
      userWithPassword.password,
    );
    if (!passwordMatch) {
      return res.status(400).json({
        message: "Password is invalid!!! please enter correct password",
      });
    }

    const token = jwt.sign(
      { userId: existingUser._id },
      process.env.SECRET_KEY,
      { expiresIn: "1d" },
    );

    return res
      .cookie("token", token, {
        httpOnly: true,
        sameSite: "strict",
        maxAge: 1 * 24 * 60 * 60 * 1000,
      })
      .json({
        message: `Welcome back ${existingUser.username}`,
        success: true,
        existingUser,
      });

    // return res
    //   .status(200)
    //   .json({ message: "Login Successfully", existingUser });
  } catch (error) {
    console.log("Login Error:", error);
  }
};

export const Logout = async (req, res) => {
  try {
    return res.cookie("token", "", { maxAge: 0 }).json({
      message: "Logout Successfully",
      success: true,
    });
  } catch (error) {
    console.log("Logout Error:", error);
  }
};
