import "dotenv/config";
import { PrismaClient } from "../app/generated/prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import bcrypt from "bcryptjs";

const rawUrl = (process.env.DATABASE_URL || "file:./dev.db").trim();
let url = rawUrl;
let authToken: string | undefined;
if (rawUrl.includes("?authToken=")) {
  const [base, query] = rawUrl.split("?");
  authToken = new URLSearchParams(query).get("authToken")?.trim() ?? undefined;
  url = base;
}
const adapter = new PrismaLibSql({ url, authToken } as any);
const prisma = new PrismaClient({ adapter } as any);

async function main() {
  const hash = await bcrypt.hash("temple2026", 10);
  await prisma.adminUser.upsert({
    where: { username: "test" },
    update: { passwordHash: hash },
    create: { username: "test", passwordHash: hash },
  });
  // 古い admin ユーザーを削除
  await prisma.adminUser.deleteMany({ where: { username: "admin" } });
  console.log("✅ 管理者を test/temple2026 に更新しました");
}

main().catch(console.error).finally(() => prisma.$disconnect());
