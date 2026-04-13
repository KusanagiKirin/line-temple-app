import { prisma } from "@/lib/prisma";
import { calcDistance } from "@/lib/distance";
import { getAuthUser } from "@/lib/auth";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const hasGoshuin = searchParams.get("hasGoshuin");
  const receptionType = searchParams.get("receptionType");
  const hasOmamori = searchParams.get("hasOmamori");
  const hasParking = searchParams.get("hasParking");
  const city = searchParams.get("city");
  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const where: any = {};
  if (hasGoshuin === "true") where.hasGoshuin = true;
  if (receptionType && receptionType !== "all") where.receptionType = receptionType;
  if (hasOmamori === "true") where.hasOmamori = true;
  if (hasParking === "true") where.hasParking = true;
  if (city) where.city = { contains: city };

  const temples = await prisma.temple.findMany({ where, orderBy: { name: "asc" } });

  // 位置情報があれば距離でソート
  if (lat && lng) {
    const userLat = parseFloat(lat);
    const userLng = parseFloat(lng);
    const withDistance = temples.map((t) => ({
      ...t,
      distance: calcDistance(userLat, userLng, t.lat, t.lng),
    }));
    withDistance.sort((a, b) => a.distance - b.distance);
    return Response.json(withDistance);
  }

  return Response.json(temples.map((t) => ({ ...t, distance: null })));
}

export async function POST(req: NextRequest) {
  const user = await getAuthUser();
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const temple = await prisma.temple.create({ data: body });
  return Response.json(temple, { status: 201 });
}
