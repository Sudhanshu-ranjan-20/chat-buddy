import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { IUser, IDecodedToken } from "@chat-buddy/shared";
import { ENVIRONMENT } from "../env";

class AuthUtils {
  SALT_ROUNDS = 10;
  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(this.SALT_ROUNDS);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  }
  comparePassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }
  generateAccessToken({
    userId,
    email,
  }: {
    userId: string;
    email: string;
  }): string {
    return jwt.sign({ userId, email }, ENVIRONMENT.JWT_SECRET, {
      expiresIn: ENVIRONMENT.TOKEN_EXPIRY as any,
    });
  }
  generateRefreshToken({
    userId,
    email,
  }: {
    userId: string;
    email: string;
  }): string {
    return jwt.sign({ userId, email }, ENVIRONMENT.REFRESH_SECRET, {
      expiresIn: ENVIRONMENT.REFRESH_TOKEN_EXPIRY as any,
    });
  }
  verifyAccessToken(token: string): IDecodedToken {
    return jwt.verify(token, ENVIRONMENT.JWT_SECRET) as IDecodedToken;
  }
  verifyRefreshToken(token: string): IDecodedToken {
    return jwt.verify(token, ENVIRONMENT.REFRESH_SECRET) as IDecodedToken;
  }
}

export default new AuthUtils();
