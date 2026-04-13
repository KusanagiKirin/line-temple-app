import { prisma } from "@/lib/prisma";
import { signToken, COOKIE_NAME } from "@/lib/auth";
import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  const { username, password } = await req.json();

  const user = await prisma.adminUser.findUnique({ where: { username } });
  if (!user) {
    return Response.json({ error: "ユーザー名またはパスワードが違います" }, { status: 401 });
  }

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) {
    return Response.json({ error: "ユーザー名またはパスワードが違います" }, { status: 401 });
  }

  const token = await signToken({ userId: user.id, username: user.username });
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24,
    path: "/",
  });

  return Response.json({ ok: true, username: user.username });
}
