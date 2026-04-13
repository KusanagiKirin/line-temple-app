import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const user = await getAuthUser();
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const text = await req.text();
  const lines = text.split("\n").filter(Boolean);
  if (lines.length < 2) return Response.json({ error: "CSVにデータがありません" }, { status: 400 });

  const headers = lines[0].split(",").map((h) => h.trim().replace(/^"|"$/g, ""));
  let created = 0;
  let updated = 0;

  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    const row: Record<string, unknown> = {};
    headers.forEach((h, idx) => {
      row[h] = values[idx] ?? "";
    });

    // 型変換
    const data = {
      name: String(row.name || ""),
      prefecture: String(row.prefecture || "大阪府"),
      city: String(row.city || ""),
      address: row.address ? String(row.address) : null,
      lat: parseFloat(String(row.lat)) || 0,
      lng: parseFloat(String(row.lng)) || 0,
      phone: row.phone ? String(row.phone) : null,
      googleMapUrl: row.googleMapUrl ? String(row.googleMapUrl) : null,
      receptionType: String(row.receptionType || "none"),
      receptionNote: row.receptionNote ? String(row.receptionNote) : null,
      hasGoshuin: row.hasGoshuin === "1" || row.hasGoshuin === "true",
      goshuinNote: row.goshuinNote ? String(row.goshuinNote) : null,
      hasParking: row.hasParking === "1" || row.hasParking === "true",
      parkingNote: row.parkingNote ? String(row.parkingNote) : null,
      hasOmamori: row.hasOmamori === "1" || row.hasOmamori === "true",
      receptionHours: row.receptionHours ? String(row.receptionHours) : null,
      receptionHoursNote: row.receptionHoursNote ? String(row.receptionHoursNote) : null,
    };

    if (!data.name) continue;

    if (row.id) {
      const existing = await prisma.temple.findUnique({ where: { id: String(row.id) } });
      if (existing) {
        await prisma.temple.update({ where: { id: String(row.id) }, data });
        updated++;
        continue;
      }
    }
    await prisma.temple.create({ data });
    created++;
  }

  return Response.json({ ok: true, created, updated });
}

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (c === '"') {
      if (inQuotes && line[i + 1] === '"') { current += '"'; i++; }
      else inQuotes = !inQuotes;
    } else if (c === "," && !inQuotes) {
      result.push(current);
      current = "";
    } else {
      current += c;
    }
  }
  result.push(current);
  return result;
}
