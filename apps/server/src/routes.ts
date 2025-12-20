import express from "express";
import authRoutes from "../modules/auth/route";

export default express.Router().use("/auth", authRoutes);
