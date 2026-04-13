"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<{ total: number } | null>(null);

  useEffect(() => {
    fetch("/api/temples")
      .then((r) => {
        if (r.status === 401) { router.push("/admin/login"); return null; }
        return r.json();
      })
      .then((data) => {
        if (data) setStats({ total: data.length });
      })
      .catch(() => router.push("/admin/login"));
  }, [router]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">ダッシュボード</h1>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500">登録お寺数</p>
          <p className="text-4xl font-bold text-emerald-600 mt-1">
            {stats ? stats.total : "—"}
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link href="/admin/temples">
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:border-emerald-200 hover:shadow-md transition-all cursor-pointer">
            <div className="text-2xl mb-2">⛩️</div>
            <h2 className="font-bold text-gray-800">お寺管理</h2>
            <p className="text-sm text-gray-400 mt-1">登録・編集・削除</p>
          </div>
        </Link>
        <Link href="/admin/csv">
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:border-emerald-200 hover:shadow-md transition-all cursor-pointer">
            <div className="text-2xl mb-2">📊</div>
            <h2 className="font-bold text-gray-800">CSV入出力</h2>
            <p className="text-sm text-gray-400 mt-1">一括インポート・エクスポート</p>
          </div>
        </Link>
        <Link href="/admin/settings">
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:border-emerald-200 hover:shadow-md transition-all cursor-pointer">
            <div className="text-2xl mb-2">⚙️</div>
            <h2 className="font-bold text-gray-800">設定</h2>
            <p className="text-sm text-gray-400 mt-1">LIFF ID・アプリ設定</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
