"use client";

let initialized = false;

export async function initLiff(liffId: string | null): Promise<boolean> {
  if (!liffId) {
    console.warn("[LIFF] LIFF IDが未設定です。モックモードで動作します。");
    return false;
  }
  if (initialized) return true;

  try {
    const liff = (await import("@line/liff")).default;
    await liff.init({ liffId });
    initialized = true;
    return true;
  } catch (e) {
    console.error("[LIFF] 初期化エラー:", e);
    return false;
  }
}

export async function getLiffProfile() {
  try {
    const liff = (await import("@line/liff")).default;
    if (!liff.isLoggedIn()) return null;
    return await liff.getProfile();
  } catch {
    return null;
  }
}
