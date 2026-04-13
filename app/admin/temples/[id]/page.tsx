"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import TempleForm from "../TempleForm";

export default function EditTemplePage() {
  const params = useParams();
  const router = useRouter();
  const [initial, setInitial] = useState<Record<string, unknown> | null>(null);

  useEffect(() => {
    fetch(`/api/temples/${params.id}`)
      .then((r) => r.json())
      .then(setInitial);
  }, [params.id]);

  const handleSubmit = async (data: Record<string, unknown>) => {
    const res = await fetch(`/api/temples/${params.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      router.push("/admin/temples");
    } else {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.error || `更新に失敗しました (HTTP ${res.status})`);
    }
  };

  if (!initial) return <div className="text-gray-400 py-16 text-center">読み込み中...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">お寺 編集</h1>
      <TempleForm initialData={initial} onSubmit={handleSubmit} />
    </div>
  );
}
