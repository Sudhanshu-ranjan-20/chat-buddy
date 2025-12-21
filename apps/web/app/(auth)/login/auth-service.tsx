import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../../lib/axios";
import {
  IUserWithLoginPayload,
  IUserWithSignupPayload,
} from "@chat-buddy/shared";

export function useAuthService() {
  const queryClient = useQueryClient();
  const BASE_URL = "/auth";

  const loginUser = useMutation({
    mutationFn: (payload: IUserWithLoginPayload) =>
      api.post(`${BASE_URL}/login`, payload),
  });

  const createUser = useMutation({
    mutationFn: (payload: IUserWithSignupPayload) =>
      api.post(`${BASE_URL}/signup`, payload),

    onSuccess: (response) => {
      queryClient.setQueryData(["user"], response.data);
    },
  });

  return { createUser, loginUser };
}
