import 'next-auth';
import 'next-auth/jwt';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role: string;
      accessToken: string;
    };
  }

  interface User {
    id: string;
    name?: string | null;
    email?: string | null;
    role: string;
    accessToken: string;
    refreshToken: string; //for development purpose
    expiresAt: number;
  }
}
declare module 'next-auth/jwt' {
  interface JWT {
    id?: string;
    name?: string | undefined;
    email?: string | undefined;
    role?: string;
    accessToken?: string;
    refreshToken?: string; //for development purpose
    expiresAt?: number;
    error?: string;
  }
}
