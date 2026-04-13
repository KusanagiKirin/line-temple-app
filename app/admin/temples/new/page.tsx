"use client";

import { useRouter } from "next/navigation";
import TempleForm from "../TempleForm";

export default function NewTemplePage() {
  const router = useRouter();

  const handleSubmit = async (data: Record<string, unknown>) => {
    const res = await fetch("/api/temples", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      router.push("/admin/temples");
    } else {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.error || `登録に失敗しました (HTTP ${res.status})`);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">お寺 新規登録</h1>
      <TempleForm onSubmit={handleSubmit} />
    </div>
  );
}
