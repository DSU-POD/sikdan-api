import { error } from "console";
import MemberModel from "../../models/member.model.js";
import crypto from "crypto";

export class MemberService {
  constructor() {}

  //비밀번호 암호화
  encryptPassword(password, salt) {
    if (salt === undefined) {
      salt = crypto.randomBytes(64).toString("hex");
    }

    const key = crypto.pbkdf2Sync(this.password, salt, 999, 64, "sha512");
    return { encryptPassword: key.toString("hex"), salt };
  }

  async login(userId, password) {
    // db 통신해서 로그인 처리 해주는 코드

    // 먼저 아이디가 있는지 확인
    const idInfo = await this.findId(userId);
    if (idInfo === null) {
      throw new Error("아이디 정보가 없습니다."); //아이디 불일치
    }

    // 패스워드 암호화
    const { encryptPassword } = this.encryptPassword(password, idInfo.salt);

    // 아이디와 비밀번호로 계정 확인
    const memberInfo = await this.findMember(userId, encryptPassword);
    if (memberInfo === null) {
      throw new Error("비밀번호 정보가 없습니다."); //아이디 존재, 비밀번호 불일치
    } else {
      return {
        userId: idInfo.userId,
        password: this.password,
        nickname: idInfo.nickname,
      }; //아이디, 비밀번호 일치
    }
  }

  async findId(value, column) {
    //아이디 존재 확인
    const findInfo = await memberModel.findOne({
      where: {
        [column]: value,
      },
    });
    if (findInfo === null) {
      throw new Error("회원정보가 존재하지 않습니다.");
    }
    return findInfo;
  }

  async findMember(userId, password) {
    //아이디와 비밀번호 확인
    const findInfo = await memberModel.findOne({
      where: {
        userId: this.userId,
        password: this.password,
      },
    });
    if (findInfo === null) {
      return null;
    }
    return findInfo;
  }
}
