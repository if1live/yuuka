import type { Session } from "@supabase/supabase-js";
import { createContext } from "react";

export interface AuthState {
  session: Session | null;
}

const defaultValues: AuthState = {
  session: null,
};

export const AuthContext = createContext(defaultValues);
