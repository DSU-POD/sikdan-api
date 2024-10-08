import express from "express";
import path from "path";
import indexRouter from "./routes/index.js";
import cookieParser from "cookie-parser";
import JwtStrateGy from "./auth/jwt.strategy.js";
import bodyParser from "body-parser";
import cors from "cors";

const app = express();

//app.use(logger("dev"));
app.use(
  cors({
    origin: process.env.FRONT_ORIGIN,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(path.join(import.meta.url, "public")));

// jwt middleware
app.use(async (req, res, next) => {
  try {
    // jwt 검사 예외 경로
    const exceptPath = [
      "/member/login",
      "/member/find_id",
      "/member/find_password",
      "/member/register/complete",
      "/member/register/duplicate",
    ];
    if (!exceptPath.includes(req.path)) {
      if (
        req.headers.authorization === "" ||
        typeof req.headers.authorization !== "string"
      ) {
        throw new Error("비정상적인 접근입니다.");
      }
      const token = req.headers.authorization.split(" ")[1];
      const result = JwtStrateGy.validateJwt(token);
    }
  } catch (e) {
    next(e);
  }

  next();
});
app.use("/", indexRouter);

app.use(function (req, res, next) {
  res.send(404);
});

// 에러, 응답 전역처리
app.use((err, req, res, next) => {
  //에러 처리
  if (err instanceof Error) {
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
  } else {
    //응답 처리
    const result = "success";
    const statusCode = req.method === "POST" ? 201 : 200;
    const { message, data } = err;
    res.status(statusCode).send({
      result,
      message,
      data: data ?? "",
    });
  }
});

app.listen(3001, async () => {});
