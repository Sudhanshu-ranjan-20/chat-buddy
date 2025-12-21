"use client";

import { useState } from "react";
import { IUserWithSignupPayload } from "@chat-buddy/shared";
import { useRouter } from "next/navigation";
import { useAuthService } from "./auth-service";

export default function LoginPage() {
  const [signupPayload, setsignupPayload] = useState<IUserWithSignupPayload>({
    email: "",
    password: "",
    name: "",
  });
  const { createUser } = useAuthService();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await createUser.mutateAsync(signupPayload);
    } catch (error) {}
  };
  return (
    <div>
      signup Page
      <input
        type="email"
        placeholder="Email"
        value={signupPayload.email}
        onChange={(e) =>
          setsignupPayload({ ...signupPayload, email: e.target.value })
        }
      />
      <input
        type="name"
        placeholder="Name"
        value={signupPayload.name}
        onChange={(e) =>
          setsignupPayload({ ...signupPayload, name: e.target.value })
        }
      />
      <input
        type="password"
        placeholder="Password"
        value={signupPayload.password}
        onChange={(e) =>
          setsignupPayload({ ...signupPayload, password: e.target.value })
        }
      />
      <button onClick={handleLogin}>Signup</button>
    </div>
  );
}
