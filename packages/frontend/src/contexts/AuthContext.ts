import { createContext } from "react";

export interface AuthState {
  userId: number;
  authToken: string;
}

const defaultValues: AuthState = {
  userId: 0,
  authToken: "",
};

export const AuthContext = createContext(defaultValues);
