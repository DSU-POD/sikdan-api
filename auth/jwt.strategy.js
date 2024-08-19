import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
class JwtStrateGy {
  constructor() {}

  static createJwtToken({ memberId, userId, email }) {
    return jwt.sign(
      {
        memberId,
        userId,
        email,
      },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "168h",
      }
    );
  }

  static validateJwt(token) {
    return new Promise((resolve, reject) => {
      jwt.verify(token, process.env.JWT_SECRET_KEY, (error, decoded) => {
        if (error) reject(error);
        resolve(decoded);
      });
    });
  }
}
export default JwtStrateGy;
