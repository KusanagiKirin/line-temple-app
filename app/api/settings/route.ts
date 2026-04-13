import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";
import { NextRequest } from "next/server";

export async function GET() {
  const settings = await prisma.setting.findMany();
  const obj = Object.fromEntries(settings.map((s) => [s.key, s.value]));
  return Response.json(obj);
}

export async function PUT(req: NextRequest) {
  const user = await getAuthUser();
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const updates = Object.entries(body as Record<string, string>);

  for (const [key, value] of updates) {
    await prisma.setting.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });
  }

  return Response.json({ ok: true });
}
