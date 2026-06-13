export interface CreateUserInput {
  email: string;
  username: string;
  passwordHash: string;
  displayName: string;
}
export interface PublicUser {
  id: string;
  email: string;
  username: string;
  displayName: string;
  avatarUrl: string | null;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}
