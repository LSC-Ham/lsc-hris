import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import { randomUUID } from "crypto";

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
    session: {
        strategy: "jwt", // Credentials MUST use JWT as the transport layer
    },
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                username: { label: "Username", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                const user = await prisma.user.findUnique({
                    where: { username: credentials?.username },
                });

                if (user && credentials?.password && user.password) {
                    const isValid = await bcrypt.compare(credentials.password, user.password);
                    if (isValid) return user;
                }
                return null;
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user, trigger }) {
            if (user && trigger === "signIn") {
                const sessionToken = randomUUID();
                const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

                await prisma.session.create({
                    data: {
                        sessionToken: sessionToken,
                        userId: user.id,
                        expires: expires,
                    },
                });

                token.dbSessionToken = sessionToken;
                token.userId = user.id;
            }
            return token;
        },
        async session({ session, token }) {
            // 2. STATEFUL CHECK: Look for this token in your Postgres table
            const dbSession = await prisma.session.findUnique({
                where: { sessionToken: token.dbSessionToken as string },
            });

            // 3. IF NOT IN DATABASE, INVALIDATE THE SESSION (Kicks user out)
            if (!dbSession) {
                // Returning null or an empty object effectively "logs out" the user on the next check
                return null as any;
            }

            if (session.user) {
                (session.user as any).id = token.userId;
            }
            return session;
        },
    },
    pages: {
        signIn: "/login",
    },
    events: {
        // THIS IS THE FIX: This fires when signOut() is called
        async signOut({ token }) {
            if (token.dbSessionToken) {
                await prisma.session.delete({
                    where: { sessionToken: token.dbSessionToken as string },
                });
                console.log("Database Session Deleted Successfully");
            }
        },
    },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };