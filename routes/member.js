import express from "express";
import { MemberService } from "../services/member/member.service.js";
const router = express.Router();
const memberService = new MemberService();

router.post("/login", async function (req, res, next) {
  try {
    const result = await memberService.login();
    res.state(200).send("로그인 성공 하였습니다.");
  } catch (e) {
    res.state(400).send("로그인 실패 하였습니다.");
  }
});

router.get("/find_id", async function (req, res, next) {
  try {
    const result = await memberService.findId();
    res.state(200).send("아이디는" + userId + "입니다.");
  } catch (e) {
    res.state(400).send("해당 이메일로 등록된 계정이 없습니다.");
  }
});

router.get("/find_password", async function (req, res, next) {
  try {
    const result = await memberService.findPassword();
    res.state(200).send("비밀번호는" + password + "입니다.");
  } catch (e) {
    res.state(400).send("해당 입력정보로 등록된 계정이 없습니다.");
  }
});

export default router;
