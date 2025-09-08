// src/api/hotel.ts
import express, { Request, Response, NextFunction } from "express";
import {
  getAllHotels,
  createHotel,
  getHotelById,
  updateHotel,
  patchHotel,
  deleteHotel,
} from "../application/hotel";
import isAuthenticated from "./middleware/authentication-middleware";
import isAdmin from "./middleware/authorization-middleware";
import { respondToAIQuery } from "../application/ai";

const hotelsRouter = express.Router();

hotelsRouter
  .route("/")
  .get(getAllHotels)                             // public
  .post(isAuthenticated, isAdmin, createHotel);  // protected

hotelsRouter.route("/ai").post(respondToAIQuery); // if public AI search

hotelsRouter
  .route("/:_id")
  .get(getHotelById)                               // public
  .put(isAuthenticated, isAdmin, updateHotel)      // protected
  .patch(isAuthenticated, isAdmin, patchHotel)     // protected
  .delete(isAuthenticated, isAdmin, deleteHotel);  // protected

export default hotelsRouter;
