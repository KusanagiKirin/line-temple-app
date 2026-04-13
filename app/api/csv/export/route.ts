import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

export async function GET() {
  const user = await getAuthUser();
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const temples = await prisma.temple.findMany({ orderBy: { name: "asc" } });

  const headers = [
    "id", "name", "prefecture", "city", "address",
    "lat", "lng", "phone", "googleMapUrl",
    "receptionType", "receptionNote",
    "hasGoshuin", "goshuinNote",
    "hasParking", "parkingNote",
    "hasOmamori",
    "receptionHours", "receptionHoursNote",
  ];

  const rows = temples.map((t) =>
    headers.map((h) => {
      const val = (t as Record<string, unknown>)[h];
      if (val === null || val === undefined) return "";
      if (typeof val === "boolean") return val ? "1" : "0";
      const str = String(val);
      return str.includes(",") || str.includes('"') || str.includes("\n")
        ? `"${str.replace(/"/g, '""')}"`
        : str;
    }).join(",")
  );

  const csv = [headers.join(","), ...rows].join("\n");

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="temples_${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
