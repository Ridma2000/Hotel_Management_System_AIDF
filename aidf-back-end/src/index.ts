import "dotenv/config";

import express from "express";
import cors from "cors";

import hotelsRouter from "./api/hotel";
import connectDB from "./infrastructure/db";
import reviewRouter from "./api/review";
import locationsRouter from "./api/location";
import globalErrorHandlingMiddleware from "./api/middleware/global-error-handling-middleware";

import { clerkMiddleware } from "@clerk/express";

// Check environment variables
console.log("Environment check:");
console.log("- MONGODB_URL:", process.env.MONGODB_URL ? "✓ Set" : "✗ Missing");
console.log("- CLERK_PUBLISHABLE_KEY:", process.env.CLERK_PUBLISHABLE_KEY ? "✓ Set" : "✗ Missing");
console.log("- CLERK_SECRET_KEY:", process.env.CLERK_SECRET_KEY ? "✓ Set" : "✗ Missing");

const app = express();

// Convert HTTP payloads into JS objects
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
  })
);
app.use(clerkMiddleware()); // Reads the JWT from the request and sets the auth object on the request

// app.use((req, res, next) => {
//   console.log(req.method, req.url);
//   next();
// });

// Test auth endpoint
app.get("/api/auth-test", (req, res) => {
  const { getAuth } = require("@clerk/express");
  const auth = getAuth(req);
  res.json({
    isAuthenticated: !!auth.userId,
    userId: auth.userId,
    sessionClaims: auth.sessionClaims,
    hasAuthHeader: !!req.headers.authorization
  });
});

app.use("/api/hotels", hotelsRouter);
app.use("/api/reviews", reviewRouter);
app.use("/api/locations", locationsRouter);

app.use(globalErrorHandlingMiddleware);

connectDB();

const PORT = 8000;
app.listen(PORT, () => {
  console.log("Server is listening on PORT: ", PORT);
});