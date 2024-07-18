import express from "express";
import path from "path";
import indexRouter from "./routes/index.js";
import cookieParser from "cookie-parser";
import JwtStrateGy from "./auth/jwt.strategy.js";
const app = express();

//app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(import.meta.url, "public")));

// jwt middleware
app.use(async (req, res, next) => {
  try {
    if (req.headers.authrozation === "") {
      throw new Error("비정상적인 접근입니다.");
    }

    if (req.method !== "GET") {
      const [token] = req.headers.authrozation.replace("Bearer ", "");
      JwtStrateGy.validateJwt(token);
    }
    return true;
  } catch (e) {
    next(e);
  }
});
app.use("/", indexRouter);

app.use(function (req, res, next) {
  res.send(404);
});

// 에러 전역처리
app.use((err, req, res, next) => {
  const error = true;
  const { status } = err;
  let message = err.message;
  // 문법오류 처리
  if (err instanceof ReferenceError === true) {
    message = "오류가 발생하였습니다.";
  }
  res.status(err.status || 500).send({
    error,
    message,
  });
});

app.listen(3001, async () => {});
