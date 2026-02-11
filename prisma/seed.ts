import { PrismaClient, Prisma } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcrypt";
import "dotenv/config";

const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
    adapter,
});

const SALT_ROUNDS = 10;

export async function main() {
    const userData: Prisma.UserCreateInput[] = [
        {
            username: "ad03069",
            email: "hmarandang@lakeshore.edu.ph",
            password: await bcrypt.hash("@lakeshore123", SALT_ROUNDS),
        },
    ];

    for (const u of userData) {
        await prisma.user.create({ data: u });
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
