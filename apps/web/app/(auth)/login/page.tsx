"use client";

import { useState } from "react";
import {
  IUserWithLoginPayload,
  IUserWithSignupPayload,
} from "@chat-buddy/shared";
import { useRouter } from "next/navigation";
import { useAuthService } from "@services";
import { useAuthStore } from "@store";

export default function LoginPage() {
  const [signupPayload, setsignupPayload] = useState<IUserWithSignupPayload>({
    email: "",
    password: "",
    name: "",
  });
  const [loginPayload, setLoginPayload] = useState<IUserWithLoginPayload>({
    email: "",
    password: "",
  });
  const { createUser, loginUser } = useAuthService();
  const router = useRouter();
  const { setUser } = useAuthStore();

  const handleSignup = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const { status, data } = await createUser.mutateAsync(signupPayload);
      const isSuccess = status === 201;
      console.log("STATUS:::", status);
      if (isSuccess) {
        setUser(data);
        router.push("/dashboard");
      }
      window.alert(
        status === 400 ? "User already exists!" : "User created successfully"
      );
    } catch (error) {
      console.error("Error in Login/signup page");
    }
  };

  const handleLogin = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const { status, data } = await loginUser.mutateAsync(loginPayload);
      const isSuccess = status === 200;
      console.log("STATUS:::", status);
      if (isSuccess) {
        setUser(data);
        router.push("/dashboard");
      }
      window.alert(
        status === 400 ? "Cant logged in!" : "User Logged in successfully"
      );
    } catch (error) {
      console.error("Error in Login/signup page");
    }
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
      <button onClick={handleSignup}>Signup</button>
      <br />
      <hr />
      <br />
      login Page
      <input
        type="email"
        placeholder="Email"
        value={loginPayload.email}
        onChange={(e) =>
          setLoginPayload({ ...loginPayload, email: e.target.value })
        }
      />
      <input
        type="password"
        placeholder="Password"
        value={loginPayload.password}
        onChange={(e) =>
          setLoginPayload({ ...loginPayload, password: e.target.value })
        }
      />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}
