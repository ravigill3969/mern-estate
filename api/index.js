import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import userRouter from "./routes/user.route.js";
import authRouter from "./routes/auth.route.js";
import listingRouter from "./routes/listing.route.js";

import path from "path";

dotenv.config();

mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((err) => {
    console.log("Error connecting to DB:", err);
  });

const __dirname = path.resolve();

const app = express();

app.use(cookieParser());
app.use(express.json());

app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/listing", listingRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`running on ${PORT}`);
});

app.use(express.static(path.join(__dirname, "client/dist")));

app.use("*", (req, res, next) => {
  res.sendFile(path.resolve(__dirname, "client", "dist", "index.html"));
});

app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || "Something went wrong!";
  return res.status(status).json({
    success: false,
    status,
    message,
  });
});
