import {
  DB_CONSTANTS,
  HTTP_STATUS_CODES,
  IDecodedToken,
} from "@chat-buddy/shared";
import { Request, Response, NextFunction } from "express";
import UserService from "./user-service";
import { AuthUtils } from "../utils";
import { getDb } from "@chat-buddy/database";

export interface IAuthRequest extends Request {
  user?: {
    userId: string;
    email: string;
  };
}
class AuthService {
  DB_SCHEMA = DB_CONSTANTS.CHAT_BUDDY_SCHEMA;
  TBL_REFRESH_TOKENS = DB_CONSTANTS.TABLES.REFRESH_TOKENS;

  async authenticate(req: IAuthRequest, res: Response, next: NextFunction) {
    const accessToken = req.cookies?.access_token as string;

    if (!accessToken)
      return res.status(HTTP_STATUS_CODES.UNAUTHORIZED).json({
        error: "Unauthorized, Token Required!",
      });
    try {
      let decoded: IDecodedToken | null = null;
      decoded = AuthUtils.verifyAccessToken(accessToken);
      if (!decoded) {
        res.clearCookie("access_token");
        return res
          .status(HTTP_STATUS_CODES.UNAUTHORIZED)
          .json({ error: "Unauthorized!! Invalid Token" });
      }
      const user = await UserService.fetchUserByConditions({
        id: decoded.userId,
      });
      if (!user)
        return res
          .status(HTTP_STATUS_CODES.NOT_FOUND)
          .json({ error: "User cannot be found" });

      req.user = {
        userId: decoded.userId,
        email: decoded.email,
      };

      next();
    } catch (error) {
      res.clearCookie("access_token");
      console.log(error);
      throw error;
    }
  }

  async createRefreshToken({
    userId,
    refreshToken,
  }: {
    userId: string;
    refreshToken: string;
  }) {
    try {
      const knex = getDb()!;
      const query = knex(`${this.DB_SCHEMA}.${this.TBL_REFRESH_TOKENS}`).insert(
        {
          user_id: userId,
          token: refreshToken,
          expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        }
      );

      return query;
    } catch (error) {}
  }
  fetchRefreshToken(refreshToken: string) {
    const knex = getDb()!;
    const query = knex(`${this.DB_SCHEMA}.${this.TBL_REFRESH_TOKENS}`)
      .select("*")
      .where({ token: refreshToken })
      .first();

    return query;
  }
  deleteRefreshToken(refreshToken: string) {
    const knex = getDb()!;
    const query = knex(`${this.DB_SCHEMA}.${this.TBL_REFRESH_TOKENS}`)
      .delete()
      .where({ token: refreshToken });

    return query;
  }
}
export default new AuthService();
