import express, { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import { errors } from "celebrate";
import { createServer } from "node:http";
import { Server } from "socket.io";
import { createDb } from "@chat-buddy/database";
import { ENVIRONMENT } from "../env";
import routes from "./routes";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: ENVIRONMENT.CORS_ORIGIN,
    credentials: true,
  },
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

createDb({
  client: "pg",
  connection: {
    host: ENVIRONMENT.DB_HOST,
    user: ENVIRONMENT.DB_USER,
    password: ENVIRONMENT.DB_PASSWORD,
    database: ENVIRONMENT.DB_NAME,
  },
  migrations: {
    tableName: "tbl_knex_migrations",
    directory: "../db/migrations",
  },
  seeds: {
    directory: "../db/seeds",
  },
});

app.use("/", routes);

io.on("connection", (socket) => {
  console.log("Socket Connection Extablished!!", socket.id);
  socket.on("disconnect", () => {
    console.log("Client Disconnected");
  });
});

httpServer.listen(ENVIRONMENT.PORT, () => {
  console.log("Server listening on --> ", ENVIRONMENT.PORT);
});

export { app, io };
