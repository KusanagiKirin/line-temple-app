"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type TempleFormData = {
  name: string;
  prefecture: string;
  city: string;
  address: string;
  lat: string;
  lng: string;
  phone: string;
  googleMapUrl: string;
  receptionType: string;
  receptionNote: string;
  hasGoshuin: boolean;
  goshuinNote: string;
  hasParking: boolean;
  parkingNote: string;
  hasOmamori: boolean;
  receptionHours: string;
  receptionHoursNote: string;
};

type Props = {
  initialData?: Record<string, unknown>;
  onSubmit: (data: Record<string, unknown>) => Promise<void>;
};

const DEFAULTS: TempleFormData = {
  name: "", prefecture: "大阪府", city: "", address: "",
  lat: "", lng: "", phone: "", googleMapUrl: "",
  receptionType: "always", receptionNote: "",
  hasGoshuin: false, goshuinNote: "",
  hasParking: false, parkingNote: "",
  hasOmamori: false,
  receptionHours: "", receptionHoursNote: "",
};

export default function TempleForm({ initialData, onSubmit }: Props) {
  const router = useRouter();
  const [form, setForm] = useState<TempleFormData>({
    ...DEFAULTS,
    ...(initialData ? {
      name: String(initialData.name || ""),
      prefecture: String(initialData.prefecture || "大阪府"),
      city: String(initialData.city || ""),
      address: String(initialData.address || ""),
      lat: String(initialData.lat || ""),
      lng: String(initialData.lng || ""),
      phone: String(initialData.phone || ""),
      googleMapUrl: String(initialData.googleMapUrl || ""),
      receptionType: String(initialData.receptionType || "always"),
      receptionNote: String(initialData.receptionNote || ""),
      hasGoshuin: Boolean(initialData.hasGoshuin),
      goshuinNote: String(initialData.goshuinNote || ""),
      hasParking: Boolean(initialData.hasParking),
      parkingNote: String(initialData.parkingNote || ""),
      hasOmamori: Boolean(initialData.hasOmamori),
      receptionHours: String(initialData.receptionHours || ""),
      receptionHoursNote: String(initialData.receptionHoursNote || ""),
    } : {}),
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const set = (key: keyof TempleFormData, value: string | boolean) =>
    setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      await onSubmit({
        ...form,
        lat: parseFloat(form.lat) || 0,
        lng: parseFloat(form.lng) || 0,
        address: form.address || null,
        phone: form.phone || null,
        googleMapUrl: form.googleMapUrl || null,
        receptionNote: form.receptionNote || null,
        goshuinNote: form.goshuinNote || null,
        parkingNote: form.parkingNote || null,
        receptionHours: form.receptionHours || null,
        receptionHoursNote: form.receptionHoursNote || null,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "エラーが発生しました");
    } finally {
      setSaving(false);
    }
  };

  const field = (
    label: string,
    key: keyof TempleFormData,
    type = "text",
    placeholder = ""
  ) => (
    <div>
      <label className="text-sm font-medium text-gray-600 block mb-1">{label}</label>
      <input
        type={type}
        value={String(form[key])}
        onChange={(e) => set(key, e.target.value)}
        placeholder={placeholder}
        className="w-full border border-gray-200 rounded-xl px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-400"
      />
    </div>
  );

  const checkbox = (label: string, key: keyof TempleFormData) => (
    <label className="flex items-center gap-2 cursor-pointer">
      <input
        type="checkbox"
        checked={Boolean(form[key])}
        onChange={(e) => set(key, e.target.checked)}
        className="w-4 h-4 accent-emerald-600"
      />
      <span className="text-sm text-gray-700">{label}</span>
    </label>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
        <h2 className="font-semibold text-gray-700">基本情報</h2>
        {field("お寺名 *", "name", "text", "例: 四天王寺")}
        <div className="grid grid-cols-2 gap-3">
          {field("都道府県", "prefecture", "text", "例: 大阪府")}
          {field("市町村 *", "city", "text", "例: 大阪市天王寺区")}
        </div>
        {field("住所詳細", "address", "text", "例: 四天王寺1-11-18")}
        <div className="grid grid-cols-2 gap-3">
          {field("緯度 *", "lat", "number", "例: 34.6535")}
          {field("経度 *", "lng", "number", "例: 135.5165")}
        </div>
        {field("電話番号", "phone", "tel", "例: 06-6771-0066")}
        {field("Google Map URL", "googleMapUrl", "url", "https://maps.google.com/...")}
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
        <h2 className="font-semibold text-gray-700">対応状況</h2>
        <div>
          <label className="text-sm font-medium text-gray-600 block mb-2">住職・受付対応</label>
          <select
            value={form.receptionType}
            onChange={(e) => set("receptionType", e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-400"
          >
            <option value="always">常時対応</option>
            <option value="occasional">不定期対応</option>
            <option value="none">対応なし</option>
          </select>
        </div>
        {field("対応備考", "receptionNote", "text", "例: 9:00〜16:00")}
        {field("受付時間", "receptionHours", "text", "例: 9:00〜17:00")}
        {field("受付時間備考", "receptionHoursNote", "text", "例: 変更の可能性あり")}
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
        <h2 className="font-semibold text-gray-700">御朱印・お守り・駐車場</h2>
        <div className="space-y-2">
          {checkbox("御朱印あり", "hasGoshuin")}
          {form.hasGoshuin && field("御朱印備考", "goshuinNote", "text", "例: 直書き対応あり")}
        </div>
        <div className="space-y-2">
          {checkbox("お札・お守りあり", "hasOmamori")}
        </div>
        <div className="space-y-2">
          {checkbox("駐車場あり", "hasParking")}
          {form.hasParking && field("駐車場備考", "parkingNote", "text", "例: 境内有料駐車場あり")}
        </div>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={saving}
          className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold px-6 py-3 rounded-xl transition-colors"
        >
          {saving ? "保存中..." : "保存する"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/temples")}
          className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium px-6 py-3 rounded-xl transition-colors"
        >
          キャンセル
        </button>
      </div>
    </form>
  );
}
