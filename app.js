import createError from "http-errors";
import express, { json, urlencoded } from "express";
import { fileURLToPath } from "url";
// import { join, dirname } from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import cors from "cors";
import "dotenv/config";
import { clearAndSeed } from "./populate.js";
import cron from "node-cron";
import path, { dirname, join } from "node:path";

import generationRouter from "./routes/generation.js";
import pokemonTypeRouter from "./routes/pokemonType.js";
import pokemonRouter from "./routes/pokemon.js";
import pokemonFormRouter from "./routes/pokemonForm.js";
import questionRouter from "./routes/question.js";

var app = express();
// view engine setup
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
app.set("views", join(__dirname, "views"));
app.set("view engine", "jade");
if (process.env.ENV === "development") {
  const corsOptions = {
    origin: "http://localhost:3000",
    optionsSuccessStatus: 200,
  };
  app.use(cors(corsOptions));
}
app.use(logger("dev"));
app.use(json());
app.use(urlencoded({ extended: false }));
app.use(cookieParser());
if (process.env.ENV !== "development") {
  app.use(express.static(join(__dirname, "./build")));
}
app.use("/pokemontype", pokemonTypeRouter);
app.use("/generation", generationRouter);
app.use("/pokemon", pokemonRouter);
app.use("/pokemonform", pokemonFormRouter);
app.use("/question", questionRouter);
if (process.env.ENV !== "development") {
  app.get("/*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "./build", "index.html"));
  });
}
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
// eslint-disable-next-line no-unused-vars
app.use(function (err, req, res, _next) {
  res.locals.message = err.message;
  res.locals.error = process.env.ENV === "development" ? err : {};
  res.status(err.status || 500);
  res.render("error", { title: "ROUTE ERROR" });
});

cron.schedule("0 0 * * *", () => {
  clearAndSeed();
});
clearAndSeed();

export default app;
