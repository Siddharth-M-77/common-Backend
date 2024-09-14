import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`)
    console.log(connectionInstance)
    console.log(`\n MongoDB connected !! DB HOST :${connectionInstance.connection.host}`);
    
  } catch (error) {
    console.log("MONGODB connection Faild", error);
    process.exit(1);
  }
};

// (async () => {
//   try {
//     await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`);
//     app.on("error",(error)=>{
//         console.log();

//     })
//   } catch (error) {
//     console.error("Error:", error);
//   }
// })();
export default connectDB;