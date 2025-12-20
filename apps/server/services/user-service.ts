import { getDb } from "@chat-buddy/database";
import {
  DB_CONSTANTS,
  IUser,
  IUserWithSignupPayload,
} from "@chat-buddy/shared";

class UserService {
  RETURNING_FIELDS = [
    "id",
    "email",
    "name",
    "created_at",
    "updated_at",
    "last_login_at",
    "is_verified",
  ];
  DB_SCHEMA = DB_CONSTANTS.CHAT_BUDDY_SCHEMA;
  TBL_USERS = DB_CONSTANTS.TABLES.USERS;
  DB_INSTANCE = getDb()!;
  async createUser(userData: IUserWithSignupPayload): Promise<IUser | null> {
    try {
      const [user] = await this.DB_INSTANCE(
        `${this.DB_SCHEMA}.${this.TBL_USERS}`
      )
        .insert(userData)
        .onConflict(["email"])
        .ignore()
        .returning(this.RETURNING_FIELDS);
      return user || null;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}

export default new UserService();
