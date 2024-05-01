import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGOURL);
    console.log(`Connected successfully to mongodb `.bgGreen.white);
  } catch (error) {
    console.log(`Error Connecting to MongoDb ${error}`.bgRed.white);
  }
};

export default connectDB;