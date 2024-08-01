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
    const token = await memberService.login(userId, password);
    next(token);
  } catch (e) {
    next(e);
  }
});

router.post("/find_id", async function (req, res, next) {
  try {
    const { email } = req.body;
    await memberService.findId(email);
    next("회원정보에 입력한 이메일로 아이디를 발송해드렸습니다.");
  } catch (e) {
    next(e);
  }
});

router.post("/find_password", async function (req, res, next) {
  try {
    if (req.body.userId && req.body.email) {
      const { userId, email } = req.body;
      await memberService.findPassword(userId, email);
      next("회원정보에 입력한 이메일로 임시 비밀번호를 발송해드렸습니다.");
    } else {
      throw new Error();
    }
  } catch (e) {
    next(e);
  }
});

router.post("/register/complete", async (req, res, next) => {
  try {
    const { registerData } = req.body;

    await memberService.register(registerData);
    next("회원가입 되었습니다.");
  } catch (e) {
    next(e);
  }
});

export default router;
