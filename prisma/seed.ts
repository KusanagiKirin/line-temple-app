import "dotenv/config";
import { PrismaClient } from "../app/generated/prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import bcrypt from "bcryptjs";

const rawUrl = (process.env.DATABASE_URL || "file:./dev.db").trim();
let dbUrl = rawUrl;
let authToken: string | undefined;
if (rawUrl.includes("?authToken=")) {
  const [base, query] = rawUrl.split("?");
  authToken = new URLSearchParams(query).get("authToken")?.trim() ?? undefined;
  dbUrl = base;
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const adapter = new PrismaLibSql({ url: dbUrl, authToken } as any);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const prisma = new PrismaClient({ adapter } as any);

async function main() {
  // 管理者ユーザー作成
  const hash = await bcrypt.hash("admin123", 10);
  await prisma.adminUser.upsert({
    where: { username: "admin" },
    update: {},
    create: { username: "admin", passwordHash: hash },
  });

  // LIFF設定の初期値
  for (const [key, value] of [
    ["liff_id", ""],
    ["liff_channel_id", ""],
    ["app_note", ""],
  ]) {
    await prisma.setting.upsert({
      where: { key },
      update: {},
      create: { key, value },
    });
  }

  // サンプルお寺データ（関西圏）
  const temples = [
    {
      name: "四天王寺",
      prefecture: "大阪府",
      city: "大阪市天王寺区",
      address: "四天王寺1-11-18",
      lat: 34.6535,
      lng: 135.5165,
      phone: "06-6771-0066",
      googleMapUrl: "https://maps.google.com/?q=四天王寺",
      receptionType: "always",
      receptionNote: "9:00〜16:00",
      hasGoshuin: true,
      goshuinNote: "直書き対応あり",
      goshuinImages: JSON.stringify([]),
      hasParking: true,
      parkingNote: "境内有料駐車場あり",
      hasOmamori: true,
      receptionHours: "9:00〜16:00",
      receptionHoursNote: "年中無休",
    },
    {
      name: "法善寺",
      prefecture: "大阪府",
      city: "大阪市中央区",
      address: "難波1-2-16",
      lat: 34.6686,
      lng: 135.502,
      phone: "06-6211-4152",
      googleMapUrl: "https://maps.google.com/?q=法善寺",
      receptionType: "always",
      receptionNote: "",
      hasGoshuin: false,
      goshuinNote: "",
      goshuinImages: JSON.stringify([]),
      hasParking: false,
      parkingNote: "近隣駐車場あり",
      hasOmamori: true,
      receptionHours: "9:00〜21:00",
      receptionHoursNote: "",
    },
    {
      name: "清荒神清澄寺",
      prefecture: "兵庫県",
      city: "宝塚市",
      address: "米谷字清シ1番地",
      lat: 34.8245,
      lng: 135.3708,
      phone: "0797-86-6641",
      googleMapUrl: "https://maps.google.com/?q=清荒神清澄寺",
      receptionType: "always",
      receptionNote: "9:00〜17:00",
      hasGoshuin: true,
      goshuinNote: "直書き対応あり",
      goshuinImages: JSON.stringify([]),
      hasParking: true,
      parkingNote: "無料駐車場あり",
      hasOmamori: true,
      receptionHours: "9:00〜17:00",
      receptionHoursNote: "変更の可能性あり",
    },
    {
      name: "金剛寺（河内長野）",
      prefecture: "大阪府",
      city: "河内長野市",
      address: "天野町996",
      lat: 34.4198,
      lng: 135.5467,
      phone: "0721-52-2046",
      googleMapUrl: "https://maps.google.com/?q=金剛寺+河内長野",
      receptionType: "none",
      receptionNote: "住職不在のことが多い",
      hasGoshuin: true,
      goshuinNote: "書置きのみ対応",
      goshuinImages: JSON.stringify([]),
      hasParking: true,
      parkingNote: "無料駐車場あり",
      hasOmamori: false,
      receptionHours: "",
      receptionHoursNote: "要事前確認",
    },
    {
      name: "法性寺",
      prefecture: "大阪府",
      city: "大阪市北区",
      address: "天神橋2-1-8",
      lat: 34.6938,
      lng: 135.5102,
      phone: "06-6353-0025",
      googleMapUrl: "https://maps.google.com/?q=法性寺+大阪",
      receptionType: "occasional",
      receptionNote: "毎月25日・縁日のみ",
      hasGoshuin: true,
      goshuinNote: "直書き対応は要確認",
      goshuinImages: JSON.stringify([]),
      hasParking: false,
      parkingNote: "近隣駐車場利用可",
      hasOmamori: true,
      receptionHours: "10:00〜15:00",
      receptionHoursNote: "縁日のみ対応",
    },
  ];

  for (const temple of temples) {
    const existing = await prisma.temple.findFirst({ where: { name: temple.name } });
    if (!existing) {
      await prisma.temple.create({ data: temple });
    }
  }

  console.log("✅ シードデータ投入完了");
  console.log("   管理者: admin / admin123");
  console.log("   お寺サンプル: 5件");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
