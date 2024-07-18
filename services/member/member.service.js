import MemberModel from "../../models/member.model";
const crypto = require('crypto');
const memberModel = new MemberModel();

export class MemberService {

    constructor() {
        
    }

    //비밀번호 암호화
    encryptPassword(password, salt) {
        if (salt === undefined) {
            salt = crypto.randomBytes(64).toString('hex');
        };
        
        const key = crypto.pbkdf2Sync(this.password, salt, 999, 64, 'sha512');
        return { encryptPassword : key.toString('hex'), salt };
    }


    async login(id, password) {
        // db 통신해서 로그인 처리 해주는 코드

        // 먼저 아이디가 있는지 확인
        const idInfo = await this.findId(id);
        if (idInfo === null) {
            throw new Error;
        };

        // 패스워드 암호화
        const { encryptPassword } = this.encryptPassword(password, idInfo.salt)

        // 아이디와 비밀번호로 계정찾기
        const memberInfo = await this.findMember(id, encryptPassword)
        if (memberInfo === null) {
            throw new Error("로그인 정보가 없습니다.")
        } else {
            return { userId : idInfo.user_id, password : this.password, nickname : idInfo.nickname }
        }

    }

    async findId(id) {
        //아이디 찾기
        const findInfo = await memberModel.findOne({
            where : {
                user_id : this.user_id
            }
        })
        if (findInfo === null) {
            return null
        }
        return findInfo       
    }

    async findMember(id, password) {
        //아이디와 비밀번호 찾기
        const findInfo = await memberModel.findOne({
            where : {
                user_id : this.user_id,
                password : this.password
            }
        })
        if (findInfo === null) {
            return null
        }
        return findInfo
    }
    
}
