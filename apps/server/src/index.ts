import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import { errors } from "celebrate";
import { createServer } from "node:http";

import { createDb } from "@chat-buddy/database";
import { ENVIRONMENT } from "../env";
import routes from "./routes";

const app = express();
const httpServer = createServer(app);

dotenv.config();

app.use(
  cors({
    origin: ENVIRONMENT.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const dbInstance = createDb({
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
if (!dbInstance) {
  console.error("Failed to intialize database!!");
  process.exit(1);
}
console.log("Database intialized!!");

app.use("/", routes);
app.use(errors());

httpServer.listen(ENVIRONMENT.PORT, () => {
  console.log("Server listening on --> ", ENVIRONMENT.PORT);
});

export { app };
