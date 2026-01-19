import type { Session,NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { JWT } from "next-auth/jwt";

async function refreshAccessToken(token: JWT): Promise<JWT> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/refresh`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken: token.refreshToken })}
    );
    if (!res.ok) throw new Error("Refresh failed");
    const refreshedToken = await res.json();
    return {
      ...token,
      accessToken: refreshedToken.accessToken,
      expiresAt: refreshedToken.expiresAt,
    };
  } catch (error) {
    console.error("Error refreshing access token:", error);
    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}

const option: NextAuthOptions = {
  providers: [
    //Google auth
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),

    //Auht with email & Password
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "email",
          type: "email",
          placeholder: "Email",
        },
        password: {
          label: "password",
          type: "password",
          placeholder: "Password",
        },
      },

      async authorize(credentials) {
        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/login`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                email: credentials?.email,
                password: credentials?.password,
              }),
              credentials: "include",
            }
          );
          if (!res.ok) throw new Error("access failed");

          const data = await res.json();

          if (!res.ok) {
            throw new Error(data.error || "Login failed");
          }
          return {
            id: data.user.user_id,
            name: data.user.user_name,
            email: data.user.user_email,
            role: data.user.role,
            accessToken: data.token,
            refreshToken: data.refreshToken, //for development purpose
            expiresAt: data.expiresAt,
          };
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
  ],

  //callbacks
  callbacks: {
    async jwt({ token, user }): Promise<JWT> {
      if (user) {
        return {
          ...token,
          id: user.id,
          name: user.name ?? undefined,
          email: user.email ?? undefined,
          role: user.role,
          accessToken: user.accessToken,
          refreshToken: user.refreshToken,//for development purpose
          expiresAt: user.expiresAt,
        };
      }
      if (token.error === 'RefreshAccessTokenError' ) {
        return {} //broken token after refresh failure
      }
      if (token.expiresAt && Date.now() < token.expiresAt) {
        return token;
      }
      return await refreshAccessToken(token);
    },

    async session({ session, token }) : Promise <Session> {
      if (!token?.accessToken) {
        return {
          ...session,
          user: null
        }
      };
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id ?? null,
          name: token.name ?? null,
          email: token.email ?? null,
          image: session.user?.image ?? null,
          role: token.role ?? null,
          accessToken: token.accessToken,
        }
      };
    },
  },
  // if we need defaut route for login or logout
  session: { strategy: "jwt" },
};

export default option;
