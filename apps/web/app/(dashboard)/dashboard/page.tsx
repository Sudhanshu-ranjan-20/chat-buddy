"use client";

import { HTTP_STATUS_CODES } from "@chat-buddy/shared";
import { useAuthService } from "@services";
import { useAuthStore } from "@store";
export default function Dashboard() {
  const { logoutUser } = useAuthService();
  const { logout } = useAuthStore();
  const handleLogout = async (e: React.MouseEvent<HTMLButtonElement>) => {
    const { status } = await logoutUser.mutateAsync();
    if (status === HTTP_STATUS_CODES.SUCCESS_ACCEPTED) {
      logout();
      window.alert("Logged out successfully");
      location.reload();
    }
  };
  return (
    <div>
      DASHBOARD PAGE
      <div>
        <button onClick={handleLogout}>LOGOUT</button>
      </div>
    </div>
  );
}
