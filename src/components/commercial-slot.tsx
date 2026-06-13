"use client";

import { trackEvent } from "@/lib/tracking";

type CommercialSlotProps = {
  context: "briefing" | "stock" | "weekly";
};

export function CommercialSlot({ context }: CommercialSlotProps) {
  const copy =
    context === "stock"
      ? "此區塊未來可放置合作揭露或訂閱導流。目前不顯示廣告、不收集交易帳戶，也不提供個別買賣建議。"
      : context === "briefing"
        ? "市場晨報未來可串接訂閱或報告入口。目前仍以公開 Beta 示範閱讀流程為主。"
        : "週報未來可作為內容資產與訂閱入口。目前不以任何商業合作影響分數或警示。";

  return (
    <aside className="commercial-slot" aria-label="合作與揭露">
      <p className="eyebrow">Disclosure</p>
      <h2>合作與揭露</h2>
      <p>{copy}</p>
      <p>任何合作內容都必須清楚標示，且不得包裝成投資建議、保證報酬或交易指令。</p>
      <nav aria-label="相關揭露頁面">
        <a
          href="/disclaimer"
          onClick={() => trackEvent("commercial_disclosure_link_clicked", { context, href: "/disclaimer", label: "disclaimer" })}
        >
          風險聲明
        </a>
        <a
          href="/terms"
          onClick={() => trackEvent("commercial_disclosure_link_clicked", { context, href: "/terms", label: "terms" })}
        >
          使用條款
        </a>
        <a
          href="/privacy"
          onClick={() => trackEvent("commercial_disclosure_link_clicked", { context, href: "/privacy", label: "privacy" })}
        >
          隱私與資料說明
        </a>
      </nav>
    </aside>
  );
}
