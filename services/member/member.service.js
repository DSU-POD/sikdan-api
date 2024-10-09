import db from "../../models/index.js";
import crypto from "crypto";
import nodemailer from "nodemailer";
import JwtStrateGy from "../../auth/jwt.strategy.js";

export class MemberService {
  constructor() {
    this.MemberModel = db.MemberModel;
    this.FeedModel = db.FeedModel;
    this.DietModel = db.DietModel;
  }

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
    const idInfo = await this.MemberModel.findOne({
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
      throw new Error("아이디 혹은 비밀번호를 확인해주세요."); //아이디 존재, 비밀번호 불일치
    } else {
      const { id, userId, email, trainer_yn } = memberInfo;
      const token = JwtStrateGy.createJwtToken({
        memberId: id,
        userId,
        email,
        trainer_yn,
      });
      return token; //아이디, 비밀번호 일치
    }
  }

  async findId(email) {
    //아이디 찾기
    const findInfo = await this.MemberModel.findOne({
      where: {
        email,
      },
    });

    if (findInfo === null) {
      throw new Error("가입된 회원 정보가 없습니다.");
    }

    const { userId } = findInfo;
    this.sendMail(
      email,
      "[MealMate] 아이디 보내드립니다.",
      `아이디 : ${userId}`
    );

    return findInfo.userId;
  }

  async findMember(userId, password) {
    //아이디와 비밀번호 확인
    const findInfo = await this.MemberModel.findOne({
      where: {
        userId,
        password,
      },
    });
    if (findInfo === null) {
      throw new Error("가입된 회원 정보가 없습니다.");
    }
    return findInfo;
  }

  async findPassword(userId, email) {
    //비밀번호 찾기
    const findInfo = await this.MemberModel.findOne({
      where: {
        userId,
        email,
      },
    });

    if (findInfo === null) {
      throw new Error("가입된 회원 정보가 없습니다.");
    }

    if (findInfo !== null) {
      //있으면 랜덤 패스워드 생성
      const randomPassword = Math.random().toString(36).substring(2, 12);
      const { encryptPassword, salt } = this.encryptPassword(
        randomPassword,
        findInfo.salt
      );
      await this.MemberModel.update(
        {
          password: encryptPassword,
          salt,
        },
        {
          where: {
            userId,
            email,
          },
        }
      );

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

    const checkId = await this.MemberModel.findOne({
      //id 중복 체크
      where: {
        userId,
      },
    });
    if (checkId !== null) {
      throw new Error("이미 가입된 회원입니다.");
    }

    const chechNickName = await this.MemberModel.findOne({
      //nickname 중복 체크
      where: {
        nickname,
      },
    });
    if (chechNickName !== null) {
      throw new Error("이미 가입된 회원입니다.");
    }

    const checkEmail = await this.MemberModel.findOne({
      //email 중복 체크
      where: {
        email,
      },
    });
    if (checkEmail !== null) {
      throw new Error("이미 가입된 회원입니다.");
    }

    const { encryptPassword, salt } = this.encryptPassword(password);

    const result = await this.MemberModel.create({
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

  async duplicate(type, data) {
    const dulicateCheck = await this.MemberModel.findOne({
      //id, nickname, email 중복 체크
      where: { [type]: data },
    });

    if (dulicateCheck !== null) {
      throw new Error(`이미 가입된 ${type} 입니다.`);
    } else {
      return true;
    }
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

  async duplicate(type, data) {
    const dulicateCheck = await this.MemberModel.findOne({
      //id, nickname, email 중복 체크
      where: { [type]: data },
    });

    if (dulicateCheck !== null) {
      throw new Error(`이미 가입된 ${type} 입니다.`);
    } else {
      return true;
    }
  }

  async information(memberId) {
    const idInfo = await this.MemberModel.findOne({
      attributes: [
        "age",
        "height",
        "weight",
        "goal",
        "allergy",
        "nickname",
        "email",
      ],
      where: {
        id: memberId,
      },
      include: [
        {
          model: this.FeedModel,
          as: "memberFeed",
          attributes: ["likeNum", "commentNum"],
          include: {
            model: this.DietModel,
            as: "feedDiet",
            attributes: ["url"],
          },
        },
      ],
    });
    if (idInfo === null) {
      throw new Error("알 수 없는 오류가 발생하였습니다.");
    }

    return idInfo;
  }

  async editInfo(userId, editData) {
    const { height, weight, allergy } = editData || {};
    const editAllergy = allergy.length >= 1 ? allergy.join(",") : "";

    const findInfo = await this.MemberModel.findOne({
      where: {
        userId,
      },
    });

    const result = await findInfo.update({
      height,
      weight,
      allergy: editAllergy,
    });
    if (!result) {
      throw new Error("회원 정보를 업데이트에 실패하였습니다.");
    }

    return result;
  }

  async editGoal(userId, goal) {
    const findInfo = await this.MemberModel.findOne({
      where: {
        userId,
      },
    });
    const result = await findInfo.update({
      goal,
    });
    return result;
  }

  async editPassword(userId, newPassword) {
    const findInfo = await this.MemberModel.findOne({
      where: {
        userId,
      },
    });

    //새로운 패스워드, 암호화 하고 저장
    if (findInfo.password !== newPassword) {
      const { encryptPassword, salt } = this.encryptPassword(
        newPassword,
        findInfo.salt
      );
      const result = await findInfo.update({
        password: encryptPassword,
        salt,
      });
      if (!result) {
        throw new Error("회원 정보를 업데이트에 실패하였습니다.");
      }
    }

    return true;
  }
}
