import NextAuth from "next-auth";
import option from "./options";

const handler = NextAuth(option);

export { handler as GET, handler as POST };
