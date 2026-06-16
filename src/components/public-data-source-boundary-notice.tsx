type PublicDataSourceBoundaryNoticeProps = {
  context: "home" | "briefing" | "stock";
};

const contextCopy = {
  home: {
    title: "公開 Beta 使用示範資料",
    lead: "首頁目前用示範資料呈現市場燈號流程，協助你先理解狀態、成因、資料時間與下一步觀察。"
  },
  briefing: {
    title: "晨報資料邊界",
    lead: "晨報目前整理示範燈號、主要風險與下一步行動，正式資料啟用前請以觀察流程為主。"
  },
  stock: {
    title: "標的頁資料邊界",
    lead: "標的頁目前用示範資料呈現個股或 ETF 的燈號閱讀方式，尚未啟用正式資料與真實評分。"
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
          <strong>不是即時報價</strong>
          <span>公開頁先用示範資料驗證閱讀流程，不能把目前燈號當成即時交易資訊。</span>
        </li>
        <li>
          <strong>不是投資建議</strong>
          <span>燈號只協助觀察市場狀態、風險與資料更新時間，不提供買進、賣出或持有建議。</span>
        </li>
        <li>
          <strong>正式資料啟用條件</strong>
          <span>只有合法來源、資料品質、寫入回讀、回復機制與公開切換審核都通過後，才會切換真實資料。</span>
        </li>
      </ul>
      <p className="public-data-source-boundary-notice__footnote">
        若資料狀態顯示延遲或未啟用，請先查看資料更新時間與風險提示，再決定是否繼續觀察。
      </p>
    </section>
  );
}
