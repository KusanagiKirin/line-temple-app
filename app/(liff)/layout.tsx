import type { Metadata } from "next";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: "お寺を探す | 関西お寺検索",
  description: "関西圏のお寺を条件で検索できるLINEミニアプリ",
};

export default function LiffLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-stone-50">
      {children}
    </div>
  );
}
