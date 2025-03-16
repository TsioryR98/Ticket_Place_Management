import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

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
          //call Express rooute
          const url = process.env.BACK_END_URL as string;
          const res = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: credentials?.email,
              password: credentials?.password,
            }),
          });
          const data = await res.json();
          if (
            credentials?.email === data.user.user_email &&
            credentials?.password === data.user.user_passwords
          ) {
            return {
              id: data.user.user_id,
              name: data.user.user_name,
              email: data.user.user_email,
              role: data.user.role,
              //tokens
              accessToken: data.tokens.accessToken,
              refreshToken: data.tokens.refreshToken,
            };
          }
          return null;
        } catch (error) {
          throw new Error("Invalid email or password");
        }
      },
    }),
  ],

  //callbacks
  callbacks: {
    //jwt token and user
    async jwt({ token, user }) {
      if (user) {
        (token.id = user.id),
          (token.role = user.role),
          (token.accessToken = user.accessToken);
      }
      return token;
    },

    //session
    async session({ session, token }) {
      session.user.id = token.id as string;
      session.user.role = token.role as string;
      return session;
    },
  },
};

export default option;
