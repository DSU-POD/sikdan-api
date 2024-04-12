import createError from "http-errors";
import express from "express";
import path from "path";
import indexRouter from "./routes/index.js";
import cookieParser from "cookie-parser";
const app = express();

//app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(import.meta.url, "public")));

app.use("/", indexRouter);

app.use(function (req, res, next) {
  next(createError(404));
});

app.listen(3001, async () => {});
