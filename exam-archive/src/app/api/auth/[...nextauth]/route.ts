import NextAuth from "next-auth/next";
import GoogleProvider from "next-auth/providers/google";

const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  pages: {
    signIn: "/auth/signIn",
    signOut: "/auth/newUser",
    newUser: "/auth/newUser",
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
