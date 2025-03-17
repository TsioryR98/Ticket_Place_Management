import NextAuth from "next-auth";
import option from "./opions";

const handler = NextAuth(option);

export { handler as GET, handler as POST };
