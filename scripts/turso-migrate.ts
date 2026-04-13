/**
 * Turso へ Prisma マイグレーション SQL を適用するスクリプト
 * Usage: npx tsx scripts/turso-migrate.ts
 */
import "dotenv/config";
import { createClient } from "@libsql/client";
import { readFileSync, readdirSync } from "fs";
import { join } from "path";

const rawUrl = process.env.DATABASE_URL;

if (!rawUrl) {
  console.error("DATABASE_URL が設定されていません");
  process.exit(1);
}

// authToken をクエリパラメータから抽出
let clientUrl = rawUrl;
let authToken: string | undefined;

if (rawUrl.includes("?authToken=")) {
  const [base, query] = rawUrl.split("?");
  const params = new URLSearchParams(query);
  authToken = params.get("authToken") ?? undefined;
  clientUrl = base;
}

const client = createClient({
  url: clientUrl,
  authToken,
});

async function main() {
  console.log("Turso へ接続中...");

  // _prisma_migrations テーブルを作成（なければ）
  await client.execute(`
    CREATE TABLE IF NOT EXISTS "_prisma_migrations" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "checksum" TEXT NOT NULL,
      "finished_at" DATETIME,
      "migration_name" TEXT NOT NULL,
      "logs" TEXT,
      "rolled_back_at" DATETIME,
      "started_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "applied_steps_count" INTEGER NOT NULL DEFAULT 0
    )
  `);

  const migrationsDir = join(process.cwd(), "prisma", "migrations");
  const entries = readdirSync(migrationsDir, { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .map((e) => e.name)
    .sort();

  for (const migrationName of entries) {
    const sqlPath = join(migrationsDir, migrationName, "migration.sql");
    let sql: string;
    try {
      sql = readFileSync(sqlPath, "utf-8");
    } catch {
      continue;
    }

    // 適用済みチェック
    const existing = await client.execute({
      sql: `SELECT id FROM "_prisma_migrations" WHERE migration_name = ?`,
      args: [migrationName],
    });

    if (existing.rows.length > 0) {
      console.log(`  スキップ（適用済み）: ${migrationName}`);
      continue;
    }

    console.log(`  適用中: ${migrationName}`);
    // セミコロンで分割して個別に実行
    const statements = sql
      .split(";")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    for (const stmt of statements) {
      await client.execute(stmt);
    }

    const id = crypto.randomUUID();
    await client.execute({
      sql: `INSERT INTO "_prisma_migrations" (id, checksum, finished_at, migration_name, applied_steps_count)
            VALUES (?, '', datetime('now'), ?, 1)`,
      args: [id, migrationName],
    });

    console.log(`  完了: ${migrationName}`);
  }

  console.log("\nマイグレーション完了！");
  client.close();
}

main().catch((err) => {
  console.error("エラー:", err);
  process.exit(1);
});
