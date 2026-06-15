type PublicRouteReadingContractProps = {
  context: "disclaimer" | "methodology" | "privacy" | "terms";
};

const copy = {
  disclaimer: {
    title: "閱讀風險聲明時，先確認網站定位",
    body: "本網站整理市場資訊與風險提示，不提供買賣建議、保證報酬或個人化投資配置。",
    next: "若需要理解燈號如何形成，請搭配方法說明一起閱讀。"
  },
  methodology: {
    title: "閱讀方法說明時，先看分數用途",
    body: "燈號與分數用來降低市場資訊理解門檻，協助比較趨勢、風險與更新狀態。",
    next: "正式資料上線前，方法頁只說明判讀框架，不宣稱已完成真實資料服務。"
  },
  privacy: {
    title: "閱讀隱私政策時，先看目前收集範圍",
    body: "Phase 1 公開版不啟用會員登入、付款、自選追蹤或個人化警示資料。",
    next: "若未來開放會員功能，會在啟用前補充更完整的資料使用說明。"
  },
  terms: {
    title: "閱讀使用條款時，先確認責任邊界",
    body: "使用者應自行判斷資訊適用性；本網站不代替專業投資顧問或個人決策。",
    next: "若資料延遲、異常或仍在示範模式，前台會以資料狀態提示說明。"
  }
} satisfies Record<PublicRouteReadingContractProps["context"], { body: string; next: string; title: string }>;

const steps = [
  ["看定位", "確認本網站是市場資訊整理與風險辨識工具。"],
  ["看邊界", "確認資料狀態、更新時間、示範模式與非投資建議提示。"],
  ["看下一步", "回到首頁、快報或標的頁，用一致的順序閱讀市場狀態。"]
] as const;

export function PublicRouteReadingContract({ context }: PublicRouteReadingContractProps) {
  const item = copy[context];

  return (
    <section className="public-route-reading-contract" aria-label="頁面閱讀說明">
      <div className="public-route-reading-contract__intro">
        <p className="eyebrow">閱讀說明</p>
        <h2>{item.title}</h2>
        <p>{item.body}</p>
        <p>{item.next}</p>
      </div>
      <div className="public-route-reading-contract__steps" aria-label="閱讀步驟">
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
