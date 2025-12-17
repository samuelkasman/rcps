import NextAuth, { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

// TODO: Production checklist
// 1. Generate strong NEXTAUTH_SECRET: openssl rand -base64 32
// 2. Generate strong INTERNAL_API_KEY: openssl rand -hex 32
// 3. Set NEXTAUTH_URL to production domain
// 4. Update Google OAuth redirect URIs for production domain
// 5. Consider adding GitHub OAuth provider

const API_URL = process.env.API_URL || "http://localhost:3001";
const INTERNAL_API_KEY = process.env.INTERNAL_API_KEY || "dev-internal-key";

export const authOptions: NextAuthOptions = {
  providers: [
    // TODO: Set up Google OAuth credentials
    // 1. Go to https://console.cloud.google.com/
    // 2. Create project → APIs & Services → Credentials → Create OAuth client ID
    // 3. Add redirect URI: http://localhost:3000/api/auth/callback/google
    // 4. Add GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET to .env.local
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const response = await fetch(`${API_URL}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          });

          if (!response.ok) {
            return null;
          }

          const data = await response.json();
          
          if (data.user) {
            return {
              id: data.user.id,
              email: data.user.email,
              name: data.user.username,
              role: data.user.role,
            };
          }

          return null;
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/signin",
    signOut: "/auth/signout",
    error: "/auth/error",
  },
  callbacks: {
    async signIn({ user, account }) {
      // For OAuth providers, create or find user in our database
      if (account?.provider === "google" && user.email) {
        try {
          const response = await fetch(`${API_URL}/auth/oauth`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-internal-api-key": INTERNAL_API_KEY,
            },
            body: JSON.stringify({
              email: user.email,
              name: user.name,
              provider: account.provider,
              providerAccountId: account.providerAccountId,
            }),
          });

          if (response.ok) {
            const data = await response.json();
            // Store the database user ID for later use in jwt callback
            user.id = data.user.id;
            (user as any).role = data.user.role;
          }
        } catch (error) {
          console.error("OAuth user sync error:", error);
        }
      }
      return true;
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
      }
      // For OAuth, we may need to fetch user from API if id wasn't set
      if (account?.provider === "google" && !token.id && token.email) {
        try {
          const response = await fetch(`${API_URL}/auth/user-by-email?email=${encodeURIComponent(token.email as string)}`, {
            headers: { "x-internal-api-key": INTERNAL_API_KEY },
          });
          if (response.ok) {
            const data = await response.json();
            token.id = data.user.id;
            token.role = data.user.role;
          }
        } catch (error) {
          console.error("Failed to fetch user:", error);
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

