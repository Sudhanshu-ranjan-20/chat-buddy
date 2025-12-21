export const ENVIRONMENT = {
  NODE_ENV: process.env.NODE_ENV || "local",
  JWT_SECRET: process.env.JWT_SECRET || "supersecretkey",
  PORT: process.env.PORT || 4000,
  DB_HOST: process.env.DB_HOST || "localhost",
  DB_PORT: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
  DB_USER: process.env.DB_USER || "postgres",
  DB_PASSWORD: process.env.DB_PASSWORD || "postgres",
  DB_NAME: process.env.DB_NAME || "chat-buddy",
  TOKEN_EXPIRY: process.env.TOKEN_EXPIRY || "1h",
  CORS_ORIGIN: process.env.CORS_ORIGIN || "http://localhost:3000",
  CORS_CREDENTIALS: process.env.CORS_CREDENTIALS || true,
};
