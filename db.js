import mysql from "mysql2/promise";

const db = await mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  multipleStatements: true,
  waitForConnections: true,
  connectionLimit: process.env.DB_CONNECTION_LIMIT || 2,
  maxIdle: process.env.DB_MAX_IDLE || 2,
  idleTimeout: 60000, // 1min
  charset: "utf8mb4",
});

console.log("Database pool ready...");

export default db;
