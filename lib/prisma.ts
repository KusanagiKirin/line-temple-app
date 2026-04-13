import { PrismaClient } from "@/app/generated/prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

function createPrismaClient() {
  const rawUrl = (process.env.DATABASE_URL || "file:./dev.db").trim();

  let url = rawUrl;
  let authToken: string | undefined;

  if (rawUrl.includes("?authToken=")) {
    const [base, query] = rawUrl.split("?");
    authToken = new URLSearchParams(query).get("authToken")?.trim() ?? undefined;
    url = base;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const adapter = new PrismaLibSql({ url, authToken } as any);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return new PrismaClient({ adapter } as any);
}

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };
export const prisma = globalForPrisma.prisma || createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
