type PublicDataSourceBoundaryNoticeProps = {
  context: "home" | "briefing" | "stock";
};

const contextCopy = {
  home: {
    title: "目前公開版使用示範資料與受控燈號",
    lead: "首頁的目標是讓使用者快速理解產品閱讀方式。正式資料上線前，所有燈號都必須清楚標示資料狀態與限制。"
  },
  briefing: {
    title: "市場簡報仍是觀察輔助，不是投資建議",
    lead: "簡報用來整理市場狀態、風險提示與下一步觀察重點。資料切 real 前，仍須維持來源與延遲揭露。"
  },
  stock: {
    title: "個股頁目前提供閱讀流程示範",
    lead: "個股、ETF 與指數頁的分數可協助理解燈號架構，但尚未代表正式投資訊號。"
  }
} as const;

export function PublicDataSourceBoundaryNotice({ context }: PublicDataSourceBoundaryNoticeProps) {
  const copy = contextCopy[context];

  return (
    <section className="public-data-source-boundary-notice" aria-label="資料來源與使用邊界">
      <div className="public-data-source-boundary-notice__intro">
        <p className="eyebrow">資料來源邊界</p>
        <h2>{copy.title}</h2>
        <p>{copy.lead}</p>
      </div>
      <ul>
        <li>
          <strong>不是即時交易資料</strong>
          <span>目前公開頁不承諾秒級即時更新；若資料延遲或未更新，頁面會保留警示與 mock 邊界。</span>
        </li>
        <li>
          <strong>不是買賣建議</strong>
          <span>燈號用於市場狀態整理與風險辨識，不代表保證報酬、進出場點或個人化資產配置建議。</span>
        </li>
        <li>
          <strong>切換真實資料需要上線檢查</strong>
          <span>資料品質、更新時間、來源揭露、回退機制與公開文案都通過後，才會討論正式資料切換。</span>
        </li>
      </ul>
      <p className="public-data-source-boundary-notice__footnote">
        使用本網站時，請把燈號視為觀察輔助工具；實際投資決策仍需自行評估並承擔風險。
      </p>
    </section>
  );
}
