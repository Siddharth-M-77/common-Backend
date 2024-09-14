import mongoose from "mongoose";

const medicalRecordSchema = new mongoose.Schema({},{timestampstrue})

export const MedicalRecord = mongoose.model("MedicalRecord",medicalRecordSchema)