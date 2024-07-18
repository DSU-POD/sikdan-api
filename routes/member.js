import express from "express";
import { MemberService } from "../services/member/member.service";
const router = express.Router();
const memberService = new MemberService();

router.post("/login", async function (req, res, next) {
  
  try{
    const result = await memberService.login();
    res.state(200).send("로그인 성공 하였습니다.");
  }catch(e){
    res.state(400).send("로그인 정보가 없습니다.");
  }
  
});

router.get("/find_id", async function (req, res, next) {
  
  
});

router.get("/find_password", async function (req, res, next) {
  
  
});

export default router;
