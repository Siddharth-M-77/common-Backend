import { User } from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const userRegistration = async (req, res) => {
  const {fullName, username, email, password } = req.body;

  if ([username, email, password].some((field) => field?.trim() === "")) {
    return res.status(400).json({
      message: "Please fill all the fields",
      success: false,
    });
  }

  try {
    const user = await User.findOne({ $or: [{ username }, { email }] });
    if (user) {
      return res.status(409).json({
        message:
          "User is already registered with this email or username. Please try another email.",
        success: false,
      });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const createdUser = await User.create({
      fullName,
      email,
      password: hashPassword,
      username: username.toLowerCase()
    });
    const userWithoutPassword = await User.findOne({ email }).select(
      "-password"
    );

    return res.status(201).json({
      message: "User created successfully",
      userWithoutPassword,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong during registration",
      error: error.message,
      success: false,
    });
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
      userWithPassword.password
    );
    if (!passwordMatch) {
      return res.status(400).json({
        message: "Password is invalid!!! please enter correct password",
      });
    }

    const token = jwt.sign(
      { userId: existingUser._id },
      process.env.SECRET_KEY,
      { expiresIn: "1d" }
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
    return res.cookie("token","",{maxAge:0}).json({
        message:"Logout Successfully",
        success:true
    })
  } catch (error) {
    console.log("Logout Error:", error);
  }
};
