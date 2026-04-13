"use client";

import { useEffect, useState } from "react";

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    liff_id: "",
    liff_channel_id: "",
    app_note: "",
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((data) => setSettings((s) => ({ ...s, ...data })));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    try {
      await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } finally {
      setSaving(false);
    }
  };

  const set = (key: keyof typeof settings, value: string) =>
    setSettings((s) => ({ ...s, [key]: value }));

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">設定</h1>

      <form onSubmit={handleSave} className="max-w-2xl space-y-6">
        {/* LIFF設定 */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
          <h2 className="font-semibold text-gray-700">🔗 LIFF設定</h2>
          <p className="text-sm text-gray-400">
            LINE Developersコンソールで取得したLIFF IDを入力してください。<br />
            未設定の場合はモックモードで動作します（LINEなしでブラウザ確認可能）。
          </p>
          <div>
            <label className="text-sm font-medium text-gray-600 block mb-1">LIFF ID</label>
            <input
              type="text"
              value={settings.liff_id}
              onChange={(e) => set("liff_id", e.target.value)}
              placeholder="例: 1234567890-abcdefgh"
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-400 font-mono"
            />
            <p className="text-xs text-gray-400 mt-1">LINE Developers → LINEミニアプリ → LIFF → LIFF ID</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600 block mb-1">Channel ID（任意）</label>
            <input
              type="text"
              value={settings.liff_channel_id}
              onChange={(e) => set("liff_channel_id", e.target.value)}
              placeholder="例: 1234567890"
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-400 font-mono"
            />
          </div>
        </div>

        {/* メモ */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
          <h2 className="font-semibold text-gray-700">📝 メモ</h2>
          <div>
            <label className="text-sm font-medium text-gray-600 block mb-1">アプリメモ</label>
            <textarea
              value={settings.app_note}
              onChange={(e) => set("app_note", e.target.value)}
              rows={4}
              placeholder="自由メモ（クライアントへの引き継ぎ事項など）"
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-400 resize-none"
            />
          </div>
        </div>

        {/* 接続テスト手順 */}
        <div className="bg-amber-50 rounded-2xl p-5 border border-amber-100">
          <h2 className="font-semibold text-amber-800 mb-2">📋 LIFF接続手順</h2>
          <ol className="text-sm text-amber-700 space-y-1 list-decimal list-inside">
            <li>LINE Developersコンソールにログイン</li>
            <li>プロバイダー → チャネル（LINEログイン）を作成</li>
            <li>LIFF タブ → 「追加」でLIFFアプリを作成</li>
            <li>エンドポイントURL: このアプリのURL（例: https://your-domain.vercel.app）</li>
            <li>LIFF IDをこの画面に入力して保存</li>
          </ol>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={saving}
            className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold px-6 py-3 rounded-xl transition-colors"
          >
            {saving ? "保存中..." : "保存する"}
          </button>
          {saved && <span className="text-sm text-emerald-600 font-medium">✅ 保存しました</span>}
        </div>
      </form>
    </div>
  );
}
