"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Temple = {
  id: string;
  name: string;
  prefecture: string;
  city: string;
  receptionType: string;
  hasGoshuin: boolean;
  hasParking: boolean;
  hasOmamori: boolean;
};

export default function TemplesPage() {
  const router = useRouter();
  const [temples, setTemples] = useState<Temple[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  const load = () => {
    fetch("/api/temples")
      .then((r) => {
        if (r.status === 401) { router.push("/admin/login"); return null; }
        return r.json();
      })
      .then((data) => { if (data) setTemples(data); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`「${name}」を削除してよいですか？`)) return;
    setDeleting(id);
    await fetch(`/api/temples/${id}`, { method: "DELETE" });
    setDeleting(null);
    load();
  };

  const receptionLabel = (type: string) => {
    if (type === "always") return "常時";
    if (type === "occasional") return "不定期";
    return "なし";
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">お寺管理</h1>
        <Link href="/admin/temples/new">
          <button className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-4 py-2 rounded-xl text-sm transition-colors">
            + 新規登録
          </button>
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-16 text-gray-400">読み込み中...</div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50 text-gray-500">
                  <th className="text-left px-4 py-3 font-medium">お寺名</th>
                  <th className="text-left px-4 py-3 font-medium">地域</th>
                  <th className="text-center px-3 py-3 font-medium">対応</th>
                  <th className="text-center px-3 py-3 font-medium">御朱印</th>
                  <th className="text-center px-3 py-3 font-medium">駐車場</th>
                  <th className="text-center px-3 py-3 font-medium">お守り</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {temples.map((temple) => (
                  <tr key={temple.id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-800">{temple.name}</td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{temple.city}</td>
                    <td className="px-3 py-3 text-center text-xs">{receptionLabel(temple.receptionType)}</td>
                    <td className="px-3 py-3 text-center">{temple.hasGoshuin ? "✓" : "—"}</td>
                    <td className="px-3 py-3 text-center">{temple.hasParking ? "✓" : "—"}</td>
                    <td className="px-3 py-3 text-center">{temple.hasOmamori ? "✓" : "—"}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2 justify-end">
                        <Link href={`/admin/temples/${temple.id}`}>
                          <button className="text-xs text-emerald-600 hover:underline px-2 py-1 rounded hover:bg-emerald-50">編集</button>
                        </Link>
                        <button
                          onClick={() => handleDelete(temple.id, temple.name)}
                          disabled={deleting === temple.id}
                          className="text-xs text-red-500 hover:underline px-2 py-1 rounded hover:bg-red-50 disabled:opacity-50"
                        >
                          {deleting === temple.id ? "削除中..." : "削除"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {temples.length === 0 && (
                  <tr><td colSpan={7} className="text-center py-12 text-gray-400">お寺が登録されていません</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
