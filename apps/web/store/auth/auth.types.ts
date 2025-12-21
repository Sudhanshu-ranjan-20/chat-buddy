import { IUser } from "@chat-buddy/shared";

export type TAuthState = {
  user: IUser | null;
  isAuthenticated: boolean;
  setUser: (user: IUser | null) => void;
  logout: () => void;
};
