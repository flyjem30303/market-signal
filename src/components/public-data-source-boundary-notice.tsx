type PublicDataSourceBoundaryNoticeProps = {
  context: "home" | "briefing" | "stock";
};

const contextCopy = {
  home: {
    title: "資料來源與目前狀態",
    lead:
      "公開 Beta 先讓你看懂燈號、風險層級與觀察順序。正式資料上線前，首頁目前仍為示範資料，不能視為即時行情。"
  },
  briefing: {
    title: "今日解讀的資料邊界",
    lead:
      "這頁用示範資料整理市場氣氛、觀察順序與風險提示。正式資料上線前，請把解讀視為閱讀流程示範。"
  },
  stock: {
    title: "標的資料來源說明",
    lead:
      "標的頁目前仍為示範資料，用來呈現燈號、成因與風險閱讀方式。正式資料上線後會同步標示資料更新時間。"
  }
} as const;

export function PublicDataSourceBoundaryNotice({ context }: PublicDataSourceBoundaryNoticeProps) {
  const copy = contextCopy[context];

  return (
    <section className="public-data-source-boundary-notice" aria-label="資料來源與更新說明">
      <div className="public-data-source-boundary-notice__intro">
        <p className="eyebrow">資料來源</p>
        <h2>{copy.title}</h2>
        <p>{copy.lead}</p>
      </div>
      <ul>
        <li>
          <strong>預計正式來源</strong>
          <span>臺灣證券交易所 OpenAPI 與政府資料開放平臺。</span>
        </li>
        <li>
          <strong>目前狀態</strong>
          <span>目前仍為示範資料；正式資料上線前，燈號只用來展示閱讀流程。</span>
        </li>
        <li>
          <strong>閱讀邊界</strong>
          <span>資料可能延遲或調整，頁面資訊非即時行情，也不構成投資建議。</span>
        </li>
      </ul>
      <p className="public-data-source-boundary-notice__footnote">
        正式切換前會補齊來源與授權、資料更新時間、品質檢查、錯誤降級與回滾紀錄。
      </p>
    </section>
  );
}
