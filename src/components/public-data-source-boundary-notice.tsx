type PublicDataSourceBoundaryNoticeProps = {
  context: "home" | "briefing" | "stock";
};

const contextCopy = {
  home: {
    title: "目前公開版使用示範資料",
    lead: "首頁先驗證 30 秒閱讀流程、燈號層級與風險提示。正式資料來源完成驗證前，不宣稱即時真實市場資料。"
  },
  briefing: {
    title: "市場快報是決策輔助，不是投資建議",
    lead: "快報用來整理市場狀態、風險來源與下一步觀察順序。所有內容都應搭配資料時間與風險聲明閱讀。"
  },
  stock: {
    title: "個股與 ETF 頁目前是示範閱讀介面",
    lead: "此頁展示燈號、風險分數與觀察重點的呈現方式，不代表正式資料或買賣建議。"
  }
} as const;

export function PublicDataSourceBoundaryNotice({ context }: PublicDataSourceBoundaryNoticeProps) {
  const copy = contextCopy[context];

  return (
    <section className="public-data-source-boundary-notice" aria-label="資料來源邊界">
      <div className="public-data-source-boundary-notice__intro">
        <p className="eyebrow">資料邊界</p>
        <h2>{copy.title}</h2>
        <p>{copy.lead}</p>
      </div>
      <ul>
        <li>
          <strong>不是即時報價</strong>
          <span>Phase 1 先使用 mock 資料驗證產品體驗；正式資料會另行標示來源、更新時間與延遲。</span>
        </li>
        <li>
          <strong>不是買賣建議</strong>
          <span>燈號是市場資訊整理與風險辨識，不代替個人投資判斷。</span>
        </li>
        <li>
          <strong>正式資料需通過 gate</strong>
          <span>來源權利、欄位契約、覆蓋率、品質檢查與錯誤回退通過後，才可切換到正式資料。</span>
        </li>
      </ul>
      <p className="public-data-source-boundary-notice__footnote">
        這個說明會保留在公開頁，避免使用者把示範燈號誤認成正式市場訊號。
      </p>
    </section>
  );
}
