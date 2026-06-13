export type UserStatus = "ACTIVE" | "DISABLED" | "DELETED";

export interface UserRow {
  id: string;
  email: string;
  username: string;
  password_hash: string;
  display_name: string;
  avatar_url: string | null;
  status: UserStatus;
  created_at: Date;
  updated_at: Date;
}

export interface RefreshTokenRow {
  id: string;
  user_id: string;
  token_hash: string;
  revoked_at: Date | null;
  expires_at: Date;
  created_at: Date;
}

// export interface IUserWithPassword extends IUser {
//   password: string;
// }

// export interface IUserWithLoginPayload {
//   email: string;
//   password: string;
// }
// export interface IUserWithSignupPayload {
//   email: string;
//   password: string;
//   name: string;
// }
// export interface IAuthResponse {
//   token: string;
//   user: IUser;
// }

// export interface IDecodedToken {
//   userId: string;
//   email: string;
//   iat: number;
//   exp: number;
// }
