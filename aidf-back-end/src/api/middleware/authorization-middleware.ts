// src/api/middleware/authorization-middleware.ts
import { getAuth } from "@clerk/express";
import { NextFunction, Request, Response } from "express";
import ForbiddenError from "../../domain/errors/forbidden-error";

type ClaimsWithRole = {
  metadata?: {
    role?: "admin" | "user" | string;
  };
  publicMetadata?: {
    role?: "admin" | "user" | string;
  };
};

const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  const auth = getAuth(req);

  const claims = auth?.sessionClaims as ClaimsWithRole | undefined;
  const role = claims?.metadata?.role ?? claims?.publicMetadata?.role;

  if (role !== "admin") {
    return next(new ForbiddenError("Forbidden"));
  }
  return next();
};

export default isAdmin;
