import mongoose from "mongoose";

export const connectDb = async () => {
  try {
    const mongoose_uri = process.env.MONGO_URI;
    if (!mongoose_uri) {
      console.error("MongoDB URI is missing");
      process.exit(0);
    }
    await mongoose.connect(mongoose_uri);
    console.log("Connected to Database");
  } catch (error) {
    console.error(`Error connecting to database: ${error}`);
  }
};
