import type { User } from "./user";

export type UserRole = "ADMIN" | "USER" | null;

export interface AuthContextType {
  user: User | null;
  signIn: (email: string, password: string) => Promise<any>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signOut: () => void;
  isAdmin: boolean;
  role: UserRole;
}
