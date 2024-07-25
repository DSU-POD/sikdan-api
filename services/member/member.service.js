import MemberModel from "../../models/member.model.js";
import crypto from "crypto";

export class MemberService {
  constructor() {}

  //비밀번호 암호화
  encryptPassword(password, salt) {
    if (salt === undefined) {
      salt = crypto.randomBytes(64).toString("hex");
    }

    const key = crypto.pbkdf2Sync(password, salt, 999, 64, "sha512");
    return { encryptPassword: key.toString("hex"), salt };
  }

  async login(userId, password) {
    // db 통신해서 로그인 처리 해주는 코드

    // 먼저 아이디가 있는지 확인
    const idInfo = await this.findId(userId, "userId");
    // 패스워드 암호화
    const { encryptPassword } = this.encryptPassword(password, idInfo.salt);

    // 아이디와 비밀번호로 계정 확인
    const memberInfo = await this.findMember(userId, encryptPassword);
    if (memberInfo === null) {
      throw new Error("비밀번호 불일치"); //아이디 존재, 비밀번호 불일치
    } else {
      return {
        userId: idInfo.userId,
        password: this.password,
        nickname: idInfo.nickname,
      }; //아이디, 비밀번호 일치
    }
  }

  async findId(value, column) {
    //아이디 찾기
    const findInfo = await MemberModel.findOne({
      where: {
        [column]: value,
      },
    });
    if (findInfo === null) {
      throw new Error("아이디 혹은 비밀번호를 확인해주세요.");
    }
    return findInfo;
  }

  async findMember(userId, password) {
    //아이디와 비밀번호 확인
    const findInfo = await MemberModel.findOne({
      where: {
        userId,
        password,
      },
    });
    if (findInfo === null) {
      throw new Error("회원 정보가 없습니다.");
    }
    return findInfo;
  }

  async findPassword(findData) {
    const { userId, email, password } = findData;
    //비밀번호 찾기
    const findInfo = await MemberModel.findOne({
      where: {
        userId,
        email,
        password,
      },
    });
    if (findInfo === null) {
      throw new Error("회원 정보가 없습니다.");
    }
    return findInfo(password);
  }

  async register(registerData) {
    const {
      userId,
      password,
      email,
      nickname,
      gender,
      age,
      height,
      weight,
      goal,
      trainer_yn,
    } = registerData;

    const findInfo = await MemberModel.findOne({
      where: {
        userId,
      },
    });
    if (findInfo !== null) {
      throw new Error("이미 가입된 회원입니다.");
    }

    const { encryptPassword, salt } = this.encryptPassword(password);

    const result = await MemberModel.create({
      userId,
      password: encryptPassword,
      salt,
      email,
      nickname,
      gender,
      age,
      height,
      weight,
      goal,
      trainer_yn,
    });

    if (!result) {
      throw new Error("회원가입에 실패하였습니다.");
    }
    return true;
  }
}
