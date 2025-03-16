import "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    name?: string;
    email?: string;
    role?: string;
    accessToken?: string;
  }

  interface Session {
    user: {
      id: string;
      role?: string;
      accessToken?: string;
    };
  }

  interface JWT {
    id: string;
    role?: string;
    accessToken?: string;
  }
}
