import mongoose from "mongoose";

const hospitalSchema = new mongoose.Schema({},{timestampstrue})

export const Hospital = mongoose.model("Hospital",hospitalSchema)