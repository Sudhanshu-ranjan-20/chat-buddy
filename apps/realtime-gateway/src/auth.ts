import cookie from "cookie";

export const parseAuthCookie = (
  rawCookieHeader: string,
  cookieName: string
): string | null => {
  if (!rawCookieHeader) return null;
  const parsed = cookie.parse(rawCookieHeader);
  return parsed[cookieName] ?? null;
};
