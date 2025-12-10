import { createContext } from "react";
import { refreshAccessTokenType } from "../types/authTypes";
import { UserProps } from "../types/authTypes";

export type accessToken = string;
export interface AuthContextType {
  accessToken: accessToken;
  login: (access: string, user: UserProps) => void;
  logout: () => void;
  user: UserProps | null;
}

export const authContext = createContext<AuthContextType>({
  accessToken: "",
  login: () => {},
  logout: () => {},
  user: null
});

export const tk = {
  access_token: "access_token",
  user: "user_data",
};
