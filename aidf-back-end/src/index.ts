import "dotenv/config";

import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

import hotelsRouter from "./api/hotel";
import connectDB from "./infrastructure/db";
import reviewRouter from "./api/review";
import locationsRouter from "./api/location";
import bookingsRouter from "./api/booking";
import paymentsRouter from "./api/payment";
import globalErrorHandlingMiddleware from "./api/middleware/global-error-handling-middleware";
import { handleWebhook } from "./application/payment";

import { clerkMiddleware } from "@clerk/express";

console.log("Environment check:");
console.log("- MONGODB_URL:", process.env.MONGODB_URL ? "✓ Set" : "✗ Missing");
console.log("- CLERK_PUBLISHABLE_KEY:", process.env.CLERK_PUBLISHABLE_KEY ? "✓ Set" : "✗ Missing");
console.log("- CLERK_SECRET_KEY:", process.env.CLERK_SECRET_KEY ? "✓ Set" : "✗ Missing");

const app = express();

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.post(
  "/api/stripe/webhook",
  bodyParser.raw({ type: "application/json" }),
  handleWebhook
);

app.use(express.json());
app.use(clerkMiddleware());

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
app.use("/api/bookings", bookingsRouter);
app.use("/api/payments", paymentsRouter);

app.use(globalErrorHandlingMiddleware);

connectDB();

const PORT = 8000;
app.listen(PORT, "0.0.0.0", () => {
  console.log("Server is listening on 0.0.0.0:", PORT);
});
