type PublicDataSourceBoundaryNoticeProps = {
  context: "home" | "briefing" | "stock";
};

const contextCopy = {
  home: {
    lead: "首頁只保留簡短資料狀態；完整資料來源、覆蓋率與風險說明集中在方法與風險頁。",
    title: "資料說明已收斂"
  },
  briefing: {
    lead: "市場簡報聚焦狀態、原因與下一步觀察；資料限制用簡短狀態列提示。",
    title: "簡報保留必要邊界"
  },
  stock: {
    lead: "標的頁聚焦單一標的狀態與風險，不在主流程重複完整資料治理說明。",
    title: "標的頁保留短提示"
  }
} as const;

export function PublicDataSourceBoundaryNotice({ context }: PublicDataSourceBoundaryNoticeProps) {
  const copy = contextCopy[context];

  return (
    <section className="public-data-source-boundary-notice" aria-label="資料來源與使用邊界">
      <div className="public-data-source-boundary-notice__intro">
        <p className="eyebrow">資料邊界</p>
        <h2>{copy.title}</h2>
        <p>{copy.lead}</p>
      </div>
      <ul>
        <li>
          <strong>不是投資建議</strong>
          <span>燈號與分數用於市場觀察，不提供個別買賣建議或保證報酬。</span>
        </li>
        <li>
          <strong>非即時行情</strong>
          <span>Phase 1 使用正式資料與日收盤價，頁面會揭露更新日期與資料狀態。</span>
        </li>
        <li>
          <strong>完整說明集中</strong>
          <span>資料來源、覆蓋範圍與方法細節集中在方法說明與風險聲明頁。</span>
        </li>
      </ul>
      <p className="public-data-source-boundary-notice__footnote">
        若資料缺漏、延遲或讀取失敗，公開頁會保守揭露，不把不完整資料包裝成即時正式行情。
      </p>
    </section>
  );
}
