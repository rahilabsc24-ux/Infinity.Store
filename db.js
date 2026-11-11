import mongoose from "mongoose";

export async function connectDB(uri = "mongodb://127.0.0.1:27017/infinity-store") {
  mongoose.set("strictQuery", true);
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 8000 });
  console.log(`MongoDB connected: ${mongoose.connection.host}/${mongoose.connection.name}`);
}
