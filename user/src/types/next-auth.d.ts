import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role: string;
      accessToken: string;
      refreshToken: string;
    };
  }

  interface User {
    id: string;
    name?: string | null;
    email?: string | null;
    role: string;
    accessToken: string;
    refreshToken: string;
  }

  interface JWT {
    id: string;
    name?: string | null;
    email?: string | null;
    role: string;
    accessToken: string;
    refreshToken: string;
  }
}
