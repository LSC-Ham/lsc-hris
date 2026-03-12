import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import { randomUUID } from "crypto";

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
    session: {
        strategy: "jwt",
    },
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                username: { label: "Username", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.username || !credentials?.password) {
                    return null;
                }
                const user = await prisma.user.findFirst({
                    where: {
                        OR: [
                            { username: credentials?.username },
                            { biography: { employees: { id_number: credentials?.username, } } }
                        ]
                    },
                });

                if (user && user.password) {
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

                const emp = await prisma.employees.findFirst({
                    where: { biography: { users: { id: user.id } } },
                    select: { departments: { select: { department: true } } }
                });
                
                token.dbSessionToken = sessionToken;
                token.userId = user.id;
                token.role = (user as any).role;
                token.department = emp?.departments?.department || null;
            }
            return token;
        },
        async session({ session, token }) {
            const dbSession = await prisma.session.findUnique({
                where: { sessionToken: token.dbSessionToken as string },
            });

            if (!dbSession) {
                return { ...session, user: undefined } as any;
            }

            if (session.user) {
                (session.user as any).id = token.userId;
                (session.user as any).role = token.role;
                (session.user as any).department = token.department;
            }
            return session;
        },
    },
    events: {

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