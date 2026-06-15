type PublicDataSourceBoundaryNoticeProps = {
  context: "home" | "briefing" | "stock";
};

const contextCopy = {
  home: {
    title: "目前資料邊界",
    lead:
      "首頁先用示範資料呈現指數燈號閱讀方式。正式每日資料、寫入回讀與正式資料切換檢查完成前，不會宣稱即時真實資料。"
  },
  briefing: {
    title: "市場簡報的資料邊界",
    lead:
      "簡報內容用來示範如何閱讀市場狀態、原因與風險提醒。若資料未更新或仍為示範資料，前台會明確顯示。"
  },
  stock: {
    title: "個股頁的資料邊界",
    lead:
      "個股頁目前提供示範燈號、風險說明與觀察流程。正式資料啟用前，請勿把分數視為交易訊號。"
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
          <strong>來源</strong>
          <span>只使用可驗證、可公開說明的資料來源；未完成來源確認前維持 mock。</span>
        </li>
        <li>
          <strong>更新</strong>
          <span>正式資料上線後會顯示更新時間；資料異常時會降級提示。</span>
        </li>
        <li>
          <strong>用途</strong>
          <span>本網站定位為市場資訊整理與風險辨識工具，不提供買賣建議。</span>
        </li>
      </ul>
      <p className="public-data-source-boundary-notice__footnote">
        任何燈號都應搭配原因、時間與風險提示閱讀，不應單獨作為投資決策依據。
      </p>
    </section>
  );
}
