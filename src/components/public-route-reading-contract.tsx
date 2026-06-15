type PublicRouteReadingContractProps = {
  context: "disclaimer" | "methodology" | "privacy" | "terms";
};

const copy = {
  disclaimer: {
    title: "先確認免責聲明，再使用燈號判斷",
    body: "本網站提供市場資訊整理、風險辨識與觀察輔助，不提供買賣建議、保證報酬或個人化投資決策。",
    next: "請搭配資料狀態、更新時間、方法說明與自身風險承受度判斷。"
  },
  methodology: {
    title: "先理解分數用途，再閱讀燈號",
    body: "燈號與分數用來降低市場資訊理解門檻，協助比較趨勢、風險與更新狀態。",
    next: "正式資料上線前，方法頁只說明判讀框架，不宣稱已完成真實資料服務。"
  },
  privacy: {
    title: "Phase 1 不啟用會員或付款資料",
    body: "公開免費版只需要一般瀏覽資料，不啟用會員登入、付款、自選清單儲存或個人化警示。",
    next: "未來若導入會員功能，會先補充資料收集目的、使用範圍、保存期間與刪除方式。"
  },
  terms: {
    title: "使用條款先定義資訊服務邊界",
    body: "本網站是市場資訊整理與風險辨識工具，不是交易、投顧、券商或資產配置服務。",
    next: "使用者應自行評估資訊是否適用於自身情況，並理解資料可能延遲或仍為示範資料。"
  }
} satisfies Record<PublicRouteReadingContractProps["context"], { body: string; next: string; title: string }>;

const steps = [
  ["看定位", "確認本網站是市場資訊整理與風險辨識工具。"],
  ["看資料", "確認資料狀態、更新時間、示範模式與非即時邊界。"],
  ["看下一步", "回到首頁、簡報或個股頁，把資訊放回完整市場脈絡。"]
] as const;

export function PublicRouteReadingContract({ context }: PublicRouteReadingContractProps) {
  const item = copy[context];

  return (
    <section className="public-route-reading-contract" aria-label="閱讀說明">
      <div className="public-route-reading-contract__intro">
        <p className="eyebrow">閱讀說明</p>
        <h2>{item.title}</h2>
        <p>{item.body}</p>
        <p>{item.next}</p>
      </div>
      <div className="public-route-reading-contract__steps" aria-label="閱讀順序">
        {steps.map(([title, body]) => (
          <article key={title}>
            <strong>{title}</strong>
            <p>{body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
