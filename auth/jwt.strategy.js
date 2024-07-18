import * as jwt from "jsonwebtoken";

class JwtStrateGy {
  constructor() {}

  static createJwtToken({ login, email }) {
    return jwt.sign(
      {
        login,
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
