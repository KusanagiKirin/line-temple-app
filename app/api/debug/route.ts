import { NextResponse } from "next/server";

export async function GET() {
  const dbUrl = process.env.DATABASE_URL;
  const hasUrl = !!dbUrl;
  const urlPrefix = dbUrl ? dbUrl.substring(0, 40) + "..." : "未設定";
  const hasAuthToken = dbUrl?.includes("authToken") ?? false;

  try {
    const { PrismaClient } = await import("@/app/generated/prisma/client");
    const { PrismaLibSql } = await import("@prisma/adapter-libsql");

    let url = (dbUrl || "file:./dev.db").trim();
    let authToken: string | undefined;
    if (url.includes("?authToken=")) {
      const [base, query] = url.split("?");
      authToken = new URLSearchParams(query).get("authToken")?.trim() ?? undefined;
      url = base;
    }

    const adapter = new PrismaLibSql({ url, authToken } as any);
    const prisma = new PrismaClient({ adapter } as any);

    const count = await prisma.temple.count();
    await prisma.$disconnect();

    return NextResponse.json({
      ok: true,
      hasUrl,
      urlPrefix,
      hasAuthToken,
      templeCount: count,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    const stack = err instanceof Error ? err.stack : undefined;
    return NextResponse.json(
      { ok: false, hasUrl, urlPrefix, hasAuthToken, error: message, stack },
      { status: 500 }
    );
  }
}
