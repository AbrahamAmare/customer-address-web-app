import mongoose from "mongoose";

export const db_conn = async () => {
  try {
    await mongoose.connect(process.env.LOCAL_CONNECTION_STRING);
    console.log("Connected to database successfully...");
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};
