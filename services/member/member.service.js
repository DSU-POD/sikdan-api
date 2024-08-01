import MemberModel from "../../models/member.model.js";
import crypto from "crypto";
import nodemailer from "nodemailer";

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
    const idInfo = await MemberModel.findOne({
      where: {
        userId,
      },
    });

    if (idInfo === null) {
      throw new Error("아이디 혹은 비밀번호를 확인해주세요.");
    }

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

  async findId(email) {
    //아이디 찾기
    const findInfo = await MemberModel.findOne({
      where: {
        email,
      },
    });
    if (findInfo === null) {
      throw new Error("회원 정보가 없습니다.");
    }
    return findInfo.userId;
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

  async findPassword(userId, email) {
    //비밀번호 찾기
    const findInfo = await MemberModel.findOne({
      where: {
        userId,
        email,
      },
    });
    if (findInfo !== null) {
      //있으면 랜덤 패스워드 생성
      const randomPassword = Math.random().toString(36).substring(2, 12);
      const { encryptPassword, salt } = this.encryptPassword(randomPassword);
      await findInfo.save({
        password: encryptPassword,
        salt,
      });
      console.log("test");
      this.sendMail(
        email,
        "[MealMate] 임시 비밀번호 보내드립니다.",
        `임시 비밀번호 : ${randomPassword}`
      );
    }
    return true;
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

    const checkId = await MemberModel.findOne({
      //id 중복 체크
      where: {
        userId,
      },
    });
    if (checkId !== null) {
      throw new Error("이미 가입된 회원입니다.");
    }

    const chechNickName = await MemberModel.findOne({
      //nickname 중복 체크
      where: {
        nickname,
      },
    });
    if (chechNickName !== null) {
      throw new Error("이미 가입된 회원입니다.");
    }

    const checkEmail = await MemberModel.findOne({
      //email 중복 체크
      where: {
        email,
      },
    });
    if (checkEmail !== null) {
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

  sendMail(to, subject, text) {
    const transporter = nodemailer.createTransport({
      service: process.env.MAIL_TYPE,
      auth: {
        user: process.env.MAIL_ADDRESS, // 나의 (작성자) 이메일 주소
        pass: process.env.MAIL_PASSWORD, // 이메일의 비밀번호
      },
    });
    const mailOptions = {
      from: process.env.MAIL_FROM, // 작성자
      to, // 수신자
      subject, // 메일 제목
      text, // 메일 내용
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        throw new Error("이메일 발송에 실패하였습니다.");
      }

      return true;
    });
  }
}
