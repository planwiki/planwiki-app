import { supabase } from "@/lib/db";
import NextAuth, { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
        userId: { label: "UserID", type: "text" },
        accessToken: { label: "Access Token", type: "text" },
      },
      async authorize(credentials) {
        let user = null;

        // Standard email/password sign-in
        if (credentials?.email && credentials?.password) {
          const { data: session, error } =
            await supabase.auth.signInWithPassword({
              email: credentials.email,
              password: credentials.password,
            });

          if (error || !session) {
            return null;
          }

          user = session.user;
        }
        // OAuth sign-in with userId and accessToken
        else if (credentials?.userId && credentials?.accessToken) {
          // Verify the access token with Supabase
          const { data, error } = await supabase.auth.getUser(
            credentials.accessToken,
          );

          if (error || !data.user) {
            console.error("Error verifying access token:", error);
            return null;
          }

          // Verify the userId matches
          if (data.user.id !== credentials.userId) {
            console.error("User ID mismatch");
            return null;
          }

          user = data.user;
        }
        // Sign-in with userId only (for admin operations)
        else if (credentials?.userId) {
          const { data, error } = await supabase.auth.admin.getUserById(
            credentials.userId,
          );

          if (error || !data.user) {
            return null;
          }

          user = data.user;
        }

        if (!user) {
          return null;
        }

        // Return consistent user object with email
        return {
          id: user.id,
          email: user.email || "",
          name: user.user_metadata?.name || user.email?.split("@")[0] || "",
          image: user.user_metadata?.avatar_url || null,
        } as any;
      },
    }),
  ],
  session: {
    maxAge: 30 * 24 * 60 * 60,
    updateAge: 24 * 60 * 60,
    strategy: "jwt",
  },
  pages: {
    signIn: "/",
    newUser: "/",
  },
  callbacks: {
    async jwt({ token, user, trigger }) {
      if (user) {
        token.user = user as any;
      }

      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user = token.user as any;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
