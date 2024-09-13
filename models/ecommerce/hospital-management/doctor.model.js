import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema({},{timestampstrue})

export const Doctor = mongoose.model("Doctor",doctorSchema)