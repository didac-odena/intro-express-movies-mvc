import mongoose from "mongoose";

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/movies-db";

mongoose
  .connect(MONGODB_URI)
  .then(() => console.log(`Connected to MongoDB: ${MONGODB_URI}`))
  .catch((err) => console.error("Error connecting to MongoDB:", err));
