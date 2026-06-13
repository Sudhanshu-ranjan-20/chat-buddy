export interface JwtAccessPayload {
  sub: string;
  email: string;
  username: string;
}
export interface JwtRefreshPayload {
  sub: string;
  tokenId: string;
}
export interface AuthenticatedUser {
  id: string;
  email: string;
  username: string;
}
