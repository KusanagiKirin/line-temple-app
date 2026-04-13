"use client";

import { useState, useRef } from "react";

export default function CsvPage() {
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState<{ created?: number; updated?: number; error?: string } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    window.location.href = "/api/csv/export";
  };

  const handleImport = async (e: React.FormEvent) => {
    e.preventDefault();
    const file = fileRef.current?.files?.[0];
    if (!file) return;

    setImporting(true);
    setResult(null);
    try {
      const text = await file.text();
      const res = await fetch("/api/csv/import", {
        method: "POST",
        headers: { "Content-Type": "text/csv" },
        body: text,
      });
      const data = await res.json();
      if (res.ok) {
        setResult({ created: data.created, updated: data.updated });
      } else {
        setResult({ error: data.error || "インポートに失敗しました" });
      }
    } catch {
      setResult({ error: "エラーが発生しました" });
    } finally {
      setImporting(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">CSV入出力</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* エクスポート */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="font-semibold text-gray-700 mb-2">📥 エクスポート</h2>
          <p className="text-sm text-gray-400 mb-4">登録済みのお寺データをCSVでダウンロードします。</p>
          <button
            onClick={handleExport}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-xl transition-colors"
          >
            CSVダウンロード
          </button>
        </div>

        {/* インポート */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="font-semibold text-gray-700 mb-2">📤 インポート</h2>
          <p className="text-sm text-gray-400 mb-4">
            CSVファイルからお寺データを一括登録します。<br />
            idが一致する場合は更新、なければ新規作成します。
          </p>
          <form onSubmit={handleImport} className="space-y-3">
            <input
              ref={fileRef}
              type="file"
              accept=".csv"
              className="w-full text-sm text-gray-600 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:bg-emerald-50 file:text-emerald-700 file:font-medium file:cursor-pointer hover:file:bg-emerald-100"
            />
            <button
              type="submit"
              disabled={importing}
              className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-medium py-3 rounded-xl transition-colors"
            >
              {importing ? "インポート中..." : "インポート実行"}
            </button>
          </form>
          {result && (
            <div className={`mt-4 p-3 rounded-xl text-sm ${result.error ? "bg-red-50 text-red-600" : "bg-green-50 text-green-700"}`}>
              {result.error
                ? `❌ ${result.error}`
                : `✅ 新規登録: ${result.created}件 / 更新: ${result.updated}件`}
            </div>
          )}
        </div>
      </div>

      {/* CSV フォーマット説明 */}
      <div className="mt-6 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h2 className="font-semibold text-gray-700 mb-3">CSVフォーマット</h2>
        <p className="text-sm text-gray-500 mb-3">1行目はヘッダー行です。以下の列が使用されます：</p>
        <div className="overflow-x-auto">
          <table className="text-xs text-gray-600 w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-1 pr-4 font-medium text-gray-700">列名</th>
                <th className="text-left py-1 pr-4 font-medium text-gray-700">説明</th>
                <th className="text-left py-1 font-medium text-gray-700">形式</th>
              </tr>
            </thead>
            <tbody className="space-y-1">
              {[
                ["id", "ID（空白の場合は新規作成）", "text"],
                ["name", "お寺名（必須）", "text"],
                ["prefecture", "都道府県", "text"],
                ["city", "市町村（必須）", "text"],
                ["lat / lng", "緯度・経度（必須）", "数値"],
                ["receptionType", "対応状況", "always / occasional / none"],
                ["hasGoshuin / hasParking / hasOmamori", "あり/なし", "1=あり, 0=なし"],
              ].map(([col, desc, fmt]) => (
                <tr key={col} className="border-b border-gray-50">
                  <td className="py-1.5 pr-4 font-mono text-emerald-700">{col}</td>
                  <td className="py-1.5 pr-4">{desc}</td>
                  <td className="py-1.5 text-gray-400">{fmt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
