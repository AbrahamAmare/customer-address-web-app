import mongoose from "mongoose";

export const db_conn = async () => {
  try {
    if (process.env.NODE_ENV === "development") {
      await mongoose.connect(process.env.LOCAL_CONNECTION_STRING);
      console.log("Connected to local database successfully...");
    } else {
      // await mongoose.connect(process.env.PROD_CONNECTION_STRING);
      await mongoose.connect(process.env.LOCAL_CONNECTION_STRING);
      console.log("Connected to production database successfully...");
    }
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};
