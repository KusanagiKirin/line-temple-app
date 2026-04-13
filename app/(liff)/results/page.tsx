"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { formatDistance } from "@/lib/distance";
import Link from "next/link";

type Temple = {
  id: string;
  name: string;
  city: string;
  prefecture: string;
  receptionType: string;
  hasGoshuin: boolean;
  hasParking: boolean;
  hasOmamori: boolean;
  distance: number | null;
};

export default function ResultsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [temples, setTemples] = useState<Temple[]>([]);
  const [loading, setLoading] = useState(true);
  const [locationError, setLocationError] = useState(false);

  const fetchTemples = useCallback((lat?: number, lng?: number) => {
    const params = new URLSearchParams(searchParams.toString());
    if (lat !== undefined && lng !== undefined) {
      params.set("lat", String(lat));
      params.set("lng", String(lng));
    }
    setLoading(true);
    fetch(`/api/temples?${params.toString()}`)
      .then((r) => r.json())
      .then((data) => {
        setTemples(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [searchParams]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => fetchTemples(pos.coords.latitude, pos.coords.longitude),
        () => { setLocationError(true); fetchTemples(); },
        { timeout: 5000 }
      );
    } else {
      fetchTemples();
    }
  }, [fetchTemples]);

  const receptionLabel = (type: string) => {
    if (type === "always") return { text: "常時対応", color: "bg-green-100 text-green-700" };
    if (type === "occasional") return { text: "不定期対応", color: "bg-yellow-100 text-yellow-700" };
    return { text: "対応なし", color: "bg-stone-100 text-stone-500" };
  };

  return (
    <div className="max-w-md mx-auto">
      {/* ヘッダー */}
      <div className="sticky top-0 bg-white border-b border-stone-100 px-4 py-3 flex items-center gap-3 z-10">
        <button onClick={() => router.back()} className="text-stone-500 hover:text-stone-800 text-2xl">←</button>
        <div>
          <h1 className="font-bold text-stone-800">検索結果</h1>
          {!loading && (
            <p className="text-xs text-stone-400">
              {temples.length}件 {locationError ? "（位置情報なし）" : ""}
            </p>
          )}
        </div>
      </div>

      {/* コンテンツ */}
      <div className="px-4 py-3">
        {loading ? (
          <div className="text-center py-16 text-stone-400">
            <div className="text-3xl mb-2">🔍</div>
            <p>検索中...</p>
          </div>
        ) : temples.length === 0 ? (
          <div className="text-center py-16 text-stone-400">
            <div className="text-3xl mb-2">⛩️</div>
            <p>条件に合うお寺が見つかりませんでした</p>
            <button onClick={() => router.back()} className="mt-4 text-emerald-600 underline text-sm">
              条件を変更する
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {temples.map((temple) => {
              const reception = receptionLabel(temple.receptionType);
              return (
                <Link key={temple.id} href={`/temple/${temple.id}`}>
                  <div className="bg-white rounded-2xl p-4 shadow-sm border border-stone-100 active:scale-98 transition-transform">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <h2 className="font-bold text-stone-800 truncate">{temple.name}</h2>
                        <p className="text-xs text-stone-400 mt-0.5">{temple.prefecture} {temple.city}</p>
                      </div>
                      {temple.distance !== null && (
                        <span className="text-xs font-semibold text-emerald-600 whitespace-nowrap">
                          {formatDistance(temple.distance)}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${reception.color}`}>
                        {reception.text}
                      </span>
                      {temple.hasGoshuin && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 font-medium">御朱印</span>
                      )}
                      {temple.hasParking && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 font-medium">駐車場</span>
                      )}
                      {temple.hasOmamori && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 font-medium">お守り</span>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
