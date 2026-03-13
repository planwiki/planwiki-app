import { DefaultJWT } from "next-auth/jwt";
import {
  User as SupabaseUser,
  Session as SupabaseSession,
} from "@supabase/supabase-js";

declare module "next-auth" {
  interface User extends SupabaseUser {}
}

declare module "next-auth" {
  interface Session extends SupabaseSession {
    user: SupabaseUser;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {}
}
