"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { formatDistance, calcDistance } from "@/lib/distance";

type Temple = {
  id: string;
  name: string;
  prefecture: string;
  city: string;
  address: string | null;
  lat: number;
  lng: number;
  phone: string | null;
  googleMapUrl: string | null;
  receptionType: string;
  receptionNote: string | null;
  hasGoshuin: boolean;
  goshuinNote: string | null;
  goshuinImages: string | null;
  hasParking: boolean;
  parkingNote: string | null;
  hasOmamori: boolean;
  receptionHours: string | null;
  receptionHoursNote: string | null;
  distance?: number | null;
};

export default function TempleDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [temple, setTemple] = useState<Temple | null>(null);
  const [loading, setLoading] = useState(true);
  const [userPos, setUserPos] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    fetch(`/api/temples/${params.id}`)
      .then((r) => r.json())
      .then((data) => { setTemple(data); setLoading(false); })
      .catch(() => setLoading(false));

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setUserPos({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => {},
        { timeout: 5000 }
      );
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-stone-400 text-center">
          <div className="text-3xl mb-2">⛩️</div>
          <p>読み込み中...</p>
        </div>
      </div>
    );
  }

  if (!temple) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-stone-400 text-center">
          <p>お寺が見つかりませんでした</p>
          <button onClick={() => router.back()} className="mt-4 text-emerald-600 underline">戻る</button>
        </div>
      </div>
    );
  }

  const receptionLabel = () => {
    if (temple.receptionType === "always") return "常時対応";
    if (temple.receptionType === "occasional") return "不定期対応";
    return "対応なし";
  };

  const receptionColor = () => {
    if (temple.receptionType === "always") return "text-green-600";
    if (temple.receptionType === "occasional") return "text-yellow-600";
    return "text-stone-500";
  };

  const images: string[] = temple.goshuinImages ? JSON.parse(temple.goshuinImages) : [];

  const distance = userPos ? calcDistance(userPos.lat, userPos.lng, temple.lat, temple.lng) : null;

  const googleMapLink = temple.googleMapUrl || `https://maps.google.com/?q=${encodeURIComponent(temple.name + " " + (temple.address || temple.city))}`;

  return (
    <div className="max-w-md mx-auto">
      {/* ヘッダー */}
      <div className="sticky top-0 bg-white border-b border-stone-100 px-4 py-3 flex items-center gap-3 z-10">
        <button onClick={() => router.back()} className="text-stone-500 hover:text-stone-800 text-2xl">←</button>
        <h1 className="font-bold text-stone-800 truncate flex-1">{temple.name}</h1>
      </div>

      <div className="px-4 py-4 space-y-4">
        {/* ① お寺名 + ② 距離 */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-stone-100">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl font-bold text-stone-800">{temple.name}</h2>
              <p className="text-sm text-stone-400 mt-1">{temple.prefecture} {temple.city}</p>
              {temple.address && <p className="text-sm text-stone-500">{temple.address}</p>}
            </div>
            {distance !== null && (
              <div className="text-right ml-3">
                <p className="text-2xl font-bold text-emerald-600">{formatDistance(distance)}</p>
                <p className="text-xs text-stone-400">現在地から</p>
              </div>
            )}
          </div>
        </div>

        {/* ③ 対応状況 */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-stone-100">
          <h3 className="text-xs font-semibold text-stone-400 mb-2">③ 対応状況</h3>
          <p className={`font-semibold ${receptionColor()}`}>{receptionLabel()}</p>
          {temple.receptionNote && <p className="text-sm text-stone-500 mt-1">{temple.receptionNote}</p>}
        </div>

        {/* ④ 御朱印 */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-stone-100">
          <h3 className="text-xs font-semibold text-stone-400 mb-2">④ 御朱印</h3>
          {temple.hasGoshuin ? (
            <>
              <p className="font-semibold text-amber-700">御朱印あり</p>
              {temple.goshuinNote && <p className="text-sm text-stone-500 mt-1">※ {temple.goshuinNote}</p>}
              {images.length > 0 && (
                <div className="flex gap-2 mt-3 overflow-x-auto">
                  {images.map((url, i) => (
                    <img key={i} src={url} alt="御朱印" className="h-24 w-24 object-cover rounded-lg flex-shrink-0" />
                  ))}
                </div>
              )}
            </>
          ) : (
            <p className="text-stone-400">御朱印なし</p>
          )}
        </div>

        {/* ⑤ 駐車場 */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-stone-100">
          <h3 className="text-xs font-semibold text-stone-400 mb-2">⑤ 駐車場</h3>
          {temple.hasParking ? (
            <>
              <p className="font-semibold text-blue-700">あり</p>
              {temple.parkingNote && <p className="text-sm text-stone-500 mt-1">{temple.parkingNote}</p>}
            </>
          ) : (
            <p className="text-stone-400">なし</p>
          )}
        </div>

        {/* ⑥ お札・お守り */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-stone-100">
          <h3 className="text-xs font-semibold text-stone-400 mb-2">⑥ お札・お守り</h3>
          {temple.hasOmamori ? (
            <p className="font-semibold text-purple-700">あり</p>
          ) : (
            <p className="text-stone-400">なし</p>
          )}
        </div>

        {/* ⑦ 受付時間 */}
        {(temple.receptionHours || temple.receptionHoursNote) && (
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-stone-100">
            <h3 className="text-xs font-semibold text-stone-400 mb-2">⑦ 受付時間</h3>
            {temple.receptionHours && <p className="font-semibold text-stone-800">{temple.receptionHours}</p>}
            {temple.receptionHoursNote && <p className="text-sm text-stone-500 mt-1">※ {temple.receptionHoursNote}</p>}
          </div>
        )}

        {/* ⑧ 地図・位置情報 */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-stone-100">
          <h3 className="text-xs font-semibold text-stone-400 mb-3">⑧ 地図・位置情報</h3>
          <a
            href={googleMapLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold px-4 py-3 rounded-xl transition-colors"
          >
            <span>🗺️</span>
            <span>Google マップで開く</span>
          </a>
          <a
            href={`https://maps.google.com/?q=${encodeURIComponent(temple.name)}&dirflg=d`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-semibold px-4 py-3 rounded-xl transition-colors mt-2"
          >
            <span>🧭</span>
            <span>ナビ起動</span>
          </a>
        </div>

        {/* ⑨ 連絡先 */}
        {temple.phone && (
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-stone-100">
            <h3 className="text-xs font-semibold text-stone-400 mb-2">⑨ 連絡先</h3>
            <a
              href={`tel:${temple.phone}`}
              className="flex items-center gap-2 text-stone-800 font-semibold hover:text-emerald-600"
            >
              <span>📞</span>
              <span>{temple.phone}</span>
            </a>
          </div>
        )}

        <div className="h-4" />
      </div>
    </div>
  );
}
