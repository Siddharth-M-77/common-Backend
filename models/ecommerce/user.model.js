import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      min: [6, "password is at least 6 digit"],
      max: [10, "password is not greater then 10"],
    },
    avatar: [
      {
        type: String,
      },
    ],
  },
  { timestamps: true }
);
export const User = mongoose.model("User",userSchema)
