import express from "express";
import { MemberService } from "../services/member/member.service.js";
const router = express.Router();
const memberService = new MemberService();

router.post("/login", async function (req, res, next) {
  try {
    if (!req.body.userId || !req.body.password) {
      throw new Error("올바르지 않은 접근입니다.");
    }
    const { userId, password } = req.body;
    const result = await memberService.login(userId, password);
    next("로그인 성공 하였습니다.");
  } catch (e) {
    next(e);
  }
});

router.get("/find_id", async function (req, res, next) {
  try {
    const result = await memberService.findId();
    res.status(200).send("아이디는" + userId + "입니다.");
  } catch (e) {
    next(e);
  }
});

router.get("/find_password", async function (req, res, next) {
  try {
    const result = await memberService.findPassword();
    res.status(200).send("비밀번호는" + password + "입니다.");
  } catch (e) {
    next(e);
  }
});

export default router;
