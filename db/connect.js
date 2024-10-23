import mongoose from "mongoose";

const connectDb = async (connectionString) => {
  return mongoose.connect(connectionString);
};

export default connectDb;
