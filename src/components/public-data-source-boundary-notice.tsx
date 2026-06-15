type PublicDataSourceBoundaryNoticeProps = {
  context: "home" | "briefing" | "stock";
};

const contextCopy = {
  home: {
    title: "目前使用示範資料呈現市場燈號",
    lead: "Phase 1 先讓使用者看懂燈號、風險與觀察順序。正式資料尚未切換前，畫面會清楚標示資料狀態。"
  },
  briefing: {
    title: "今日簡報仍以示範資料輔助閱讀",
    lead: "簡報用來說明市場狀態的閱讀流程；正式資料來源、覆蓋率與寫入檢查完成後，才會升級為真實資料。"
  },
  stock: {
    title: "標的頁目前不是即時報價",
    lead: "個股與 ETF 頁面先呈現燈號邏輯、風險判讀與資料狀態，不提供即時交易價格或買賣建議。"
  }
} as const;

export function PublicDataSourceBoundaryNotice({ context }: PublicDataSourceBoundaryNoticeProps) {
  const copy = contextCopy[context];

  return (
    <section className="public-data-source-boundary-notice" aria-label="資料來源與使用邊界">
      <div className="public-data-source-boundary-notice__intro">
        <p className="eyebrow">資料來源與覆蓋</p>
        <h2>{copy.title}</h2>
        <p>{copy.lead}</p>
      </div>
      <ul>
        <li>
          <strong>先看狀態，不看秒級報價</strong>
          <span>網站目標是協助理解市場氛圍與風險位置，不取代券商報價或交易系統。</span>
        </li>
        <li>
          <strong>資料異常會明確標示</strong>
          <span>若資料尚未更新、覆蓋不足或仍在驗證，前台會保留示範資料並顯示邊界說明。</span>
        </li>
        <li>
          <strong>不提供投資建議</strong>
          <span>所有燈號與分數僅作資訊整理與風險辨識，使用者仍需自行判斷與承擔風險。</span>
        </li>
      </ul>
      <p className="public-data-source-boundary-notice__footnote">
        真實資料升級需要合法來源、資料品質、寫入檢查、讀回驗證、回復路徑與公開揭露都通過後才會開啟。
      </p>
    </section>
  );
}
