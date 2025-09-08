// src/api/middleware/authentication-middleware.ts
import UnauthorizedError from "../../domain/errors/unauthorized-error";
import { Request, Response, NextFunction } from "express";
import { getAuth } from "@clerk/express";

const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  const { userId } = getAuth(req);
  if (!userId) {
    return next(new UnauthorizedError("Unauthorized"));
  }
  return next();
};

export default isAuthenticated;
