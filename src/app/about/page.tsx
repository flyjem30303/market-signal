import type { Metadata } from "next";
import { buildRouteMetadata } from "@/lib/seo";

export const metadata: Metadata = buildRouteMetadata({
  description: "Market Signal 的製作人資訊與聯絡方式。",
  path: "/about",
  title: "關於 Market Signal"
});

export default function AboutPage() {
  return (
    <main className="page-shell">
      <section className="hero">
        <p className="eyebrow">About</p>
        <h1>關於 Market Signal</h1>
        <p>
          Market Signal 是一個以市場訊號與風險觀察為核心的決策輔助工具，目標是用可追溯的資料與方法論，協助使用者理解市場狀態，而不是提供投資建議。
        </p>
        <p className="runtime-boundary-line">本頁僅提供製作人與聯絡資訊，不作為產品功能入口。</p>
      </section>

      <section className="panel method-section" aria-labelledby="creator-title">
        <p className="eyebrow">Creator</p>
        <h2 id="creator-title">製作人</h2>
        <div className="method-table" role="table" aria-label="製作人資訊">
          <div className="method-row" role="row">
            <strong>名稱</strong>
            <span>Ming</span>
            <span>Market Signal 製作與維護</span>
          </div>
          <div className="method-row" role="row">
            <strong>聯絡信箱</strong>
            <span>flyjem30303@gmail.com</span>
            <span>可用於網站問題、資料勘誤或合作聯繫。</span>
          </div>
        </div>
      </section>
    </main>
  );
}
