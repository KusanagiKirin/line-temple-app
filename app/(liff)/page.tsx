"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const CITIES = [
  "大阪市北区", "大阪市中央区", "大阪市天王寺区", "大阪市住吉区", "大阪市浪速区",
  "大阪市西区", "大阪市東淀川区", "堺市", "豊中市", "吹田市", "高槻市",
  "東大阪市", "枚方市", "八尾市", "寝屋川市", "河内長野市",
  "神戸市中央区", "神戸市灘区", "神戸市東灘区", "宝塚市", "西宮市", "尼崎市",
  "京都市上京区", "京都市中京区", "京都市下京区", "京都市東山区", "京都市右京区",
  "奈良市", "橿原市", "大和郡山市",
];

export default function SearchPage() {
  const router = useRouter();
  const [hasGoshuin, setHasGoshuin] = useState(false);
  const [receptionType, setReceptionType] = useState("all");
  const [hasOmamori, setHasOmamori] = useState(false);
  const [hasParking, setHasParking] = useState(false);
  const [city, setCity] = useState("");

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (hasGoshuin) params.set("hasGoshuin", "true");
    if (receptionType !== "all") params.set("receptionType", receptionType);
    if (hasOmamori) params.set("hasOmamori", "true");
    if (hasParking) params.set("hasParking", "true");
    if (city) params.set("city", city);
    router.push(`/results?${params.toString()}`);
  };

  return (
    <div className="max-w-md mx-auto px-4 py-6">
      {/* ヘッダー */}
      <div className="text-center mb-8">
        <div className="text-4xl mb-2">⛩️</div>
        <h1 className="text-2xl font-bold text-stone-800">近くのお寺を探す</h1>
        <p className="text-sm text-stone-500 mt-1">関西圏 約1,800件から検索</p>
      </div>

      <div className="space-y-5">
        {/* 1. 御朱印 */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-stone-100">
          <h2 className="text-sm font-semibold text-stone-600 mb-3">① 御朱印</h2>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={hasGoshuin}
              onChange={(e) => setHasGoshuin(e.target.checked)}
              className="w-5 h-5 accent-emerald-600"
            />
            <span className="text-stone-800">御朱印あり</span>
          </label>
        </div>

        {/* 2. 住職・受付対応 */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-stone-100">
          <h2 className="text-sm font-semibold text-stone-600 mb-3">② 住職・受付対応</h2>
          <div className="space-y-2">
            {[
              { value: "all", label: "指定なし" },
              { value: "always", label: "常時対応" },
              { value: "occasional", label: "不定期に対応（特定の日など）" },
              { value: "none", label: "対応なし" },
            ].map((opt) => (
              <label key={opt.value} className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="receptionType"
                  value={opt.value}
                  checked={receptionType === opt.value}
                  onChange={() => setReceptionType(opt.value)}
                  className="w-5 h-5 accent-emerald-600"
                />
                <span className="text-stone-800">{opt.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* 3. お札・お守り */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-stone-100">
          <h2 className="text-sm font-semibold text-stone-600 mb-3">③ お札・お守り</h2>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={hasOmamori}
              onChange={(e) => setHasOmamori(e.target.checked)}
              className="w-5 h-5 accent-emerald-600"
            />
            <span className="text-stone-800">お札・お守りあり</span>
          </label>
        </div>

        {/* 4. 駐車場 */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-stone-100">
          <h2 className="text-sm font-semibold text-stone-600 mb-3">④ 駐車場</h2>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={hasParking}
              onChange={(e) => setHasParking(e.target.checked)}
              className="w-5 h-5 accent-emerald-600"
            />
            <span className="text-stone-800">あり</span>
          </label>
        </div>

        {/* 5. 地域 */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-stone-100">
          <h2 className="text-sm font-semibold text-stone-600 mb-3">⑤ 地域</h2>
          <select
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full border border-stone-200 rounded-xl p-3 text-stone-800 bg-stone-50 focus:outline-none focus:ring-2 focus:ring-emerald-400"
          >
            <option value="">指定なし</option>
            {CITIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* 検索ボタン */}
        <button
          onClick={handleSearch}
          className="w-full bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold py-4 rounded-2xl text-lg transition-all"
        >
          検索する
        </button>
      </div>
    </div>
  );
}
