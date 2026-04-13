import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";
import { NextRequest } from "next/server";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const temple = await prisma.temple.findUnique({ where: { id } });
  if (!temple) return Response.json({ error: "Not found" }, { status: 404 });
  return Response.json(temple);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getAuthUser();
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();
  const temple = await prisma.temple.update({ where: { id }, data: body });
  return Response.json(temple);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getAuthUser();
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await prisma.temple.delete({ where: { id } });
  return Response.json({ ok: true });
}
