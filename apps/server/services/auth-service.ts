import { HTTP_STATUS_CODES, IDecodedToken } from "@chat-buddy/shared";
import { Request, Response, NextFunction } from "express";
import UserService from "./user-service";
import { AuthUtils } from "../utils";

export interface IAuthRequest extends Request {
  user?: {
    userId: string;
    email: string;
  };
}
class AuthService {
  async authenticate(req: IAuthRequest, res: Response, next: NextFunction) {
    const accessToken = req.cookies?.access_token as string;

    if (!accessToken)
      return res.status(HTTP_STATUS_CODES.UNAUTHORIZED).json({
        error: "Unauthorized, Token Required!",
      });
    try {
      let decoded: IDecodedToken | null = null;
      decoded = AuthUtils.verifyToken(accessToken);
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
}
export default new AuthService();
