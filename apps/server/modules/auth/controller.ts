import { Request, Response } from "express";
import { HTTP_STATUS_CODES } from "@chat-buddy/shared";
import { AuthUtils } from "../../utils";
import { AuthService, UserService } from "../../services";
import { ENVIRONMENT } from "../../env";
class AuthController {
  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const user = await UserService.fetchUserByEmailForAuth(email);

      const isPasswordValid = await AuthUtils.comparePassword(
        password,
        user?.password || ""
      );

      if (!user || !isPasswordValid) {
        return res
          .status(HTTP_STATUS_CODES.NOT_FOUND)
          .json({ message: "Invalid Credentials" });
      }

      const accessToken = AuthUtils.generateAccessToken({
        userId: user.id,
        email: user.email,
      });
      const refreshToken = AuthUtils.generateRefreshToken({
        userId: user.id,
        email: user.email,
      });

      await AuthService.createRefreshToken({ userId: user.id, refreshToken });

      res.cookie("access_token", accessToken, {
        httpOnly: true,
        secure: ENVIRONMENT.NODE_ENV === "local",
        maxAge: 15 * 60 * 1000,
        sameSite: "strict",
      });
      res.cookie("refresh_token", refreshToken, {
        httpOnly: true,
        secure: ENVIRONMENT.NODE_ENV === "local",
        maxAge: 7 * 24 * 60 * 60 * 1000,
        sameSite: "strict",
      });

      res
        .status(HTTP_STATUS_CODES.SUCCESS_OK)
        .json({ message: "Logged in Successfully" });
    } catch (error) {
      console.error("Error logging in!", error);
      throw error;
    }
  }
  async signup(req: Request, res: Response) {
    try {
      const { email, name, password } = req.body;
      const hashedPassword = await AuthUtils.hashPassword(password);

      const user = await UserService.createUser({
        email,
        name,
        password: hashedPassword,
      });
      if (!user) {
        return res
          .status(HTTP_STATUS_CODES.BAD_REQUEST)
          .json({ message: "User Cannot be created!" });
      }

      const accessToken = AuthUtils.generateAccessToken({
        userId: user.id,
        email: user.email,
      });
      const refreshToken = AuthUtils.generateRefreshToken({
        userId: user.id,
        email: user.email,
      });

      await AuthService.createRefreshToken({ userId: user.id, refreshToken });

      res.cookie("access_token", accessToken, {
        httpOnly: true,
        secure: ENVIRONMENT.NODE_ENV === "local",
        maxAge: 15 * 60 * 1000,
        sameSite: "strict",
      });
      res.cookie("refresh_token", refreshToken, {
        httpOnly: true,
        secure: ENVIRONMENT.NODE_ENV === "local",
        maxAge: 7 * 24 * 60 * 60 * 1000,
        sameSite: "strict",
      });

      return res
        .status(HTTP_STATUS_CODES.SUCCESS_CREATED)
        .json({ message: "User created successfully", user, accessToken });
    } catch (error) {
      console.log("Error in user creation", error);
      throw error;
    }
  }
  async logout(req: Request, res: Response) {
    const refreshToken = req.cookies.refresh_token;
    if (refreshToken) await AuthService.deleteRefreshToken(refreshToken);
    res.clearCookie("access_token", {
      httpOnly: true,
      secure: ENVIRONMENT.NODE_ENV === "local",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: "strict",
    });
    res.clearCookie("refresh_token", {
      httpOnly: true,
      secure: ENVIRONMENT.NODE_ENV === "local",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: "strict",
    });
    res
      .status(HTTP_STATUS_CODES.SUCCESS_ACCEPTED)
      .json({ message: "User logged out!!" });
  }
  async refreshToken(req: Request, res: Response) {
    try {
      const refreshToken = req.cookies.refresh_token;
      if (!refreshToken) {
        return res
          .status(HTTP_STATUS_CODES.UNAUTHORIZED)
          .json({ message: "Unauthorized User!!" });
      }
      let user;
      try {
        user = AuthUtils.verifyRefreshToken(refreshToken);
      } catch (error) {
        return res
          .status(HTTP_STATUS_CODES.UNAUTHORIZED)
          .json({ message: "Invalid Refresh token!!" });
      }

      const storedToken = await AuthService.fetchRefreshToken(refreshToken);
      if (!storedToken)
        return res
          .status(HTTP_STATUS_CODES.UNAUTHORIZED)
          .json({ message: "Token Revoked!!" });

      await AuthService.deleteRefreshToken(refreshToken);

      const newAccessToken = AuthUtils.generateAccessToken(user);
      const newRefreshToken = AuthUtils.generateRefreshToken(user);

      await AuthService.createRefreshToken({
        userId: user.userId,
        refreshToken,
      });

      res.cookie("access_token", newAccessToken, {
        httpOnly: true,
        secure: ENVIRONMENT.NODE_ENV === "local",
        maxAge: 15 * 60 * 1000,
        sameSite: "strict",
      });
      res.cookie("refresh_token", newRefreshToken, {
        httpOnly: true,
        secure: ENVIRONMENT.NODE_ENV === "local",
        maxAge: 7 * 24 * 60 * 60 * 1000,
        sameSite: "strict",
      });

      res
        .status(HTTP_STATUS_CODES.SUCCESS_OK)
        .json({ message: "Token Refreshed Successfully!!" });
    } catch (error) {
      console.error("Error in Refreshing token", error);
      throw error;
    }
  }
}

export default new AuthController();
