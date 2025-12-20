import express from "express";
import authRoutes from "../modules/auth/route";
import { AuthService } from "../services";

export default express
  .Router()
  .use("/auth", authRoutes)
  .use(AuthService.authenticate);
