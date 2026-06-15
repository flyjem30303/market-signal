type PublicDataSourceBoundaryNoticeProps = {
  context: "home" | "briefing" | "stock";
};

const contextCopy = {
  home: {
    title: "資料來源仍維持示範邊界",
    lead: "首頁用來建立市場狀態的閱讀流程；正式資料上線前，不會宣稱即時行情、完整覆蓋或正式分數。"
  },
  briefing: {
    title: "市場簡報仍以示範資料呈現",
    lead: "市場簡報用來說明燈號、風險與觀察順序；正式資料切換前，不會宣稱即時或完整覆蓋。"
  },
  stock: {
    title: "個股燈號仍是觀察輔助",
    lead: "單一標的頁協助使用者整理市場狀態與風險分數；正式資料上線前，不作交易建議或即時資料宣稱。"
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
          <strong>目前可使用</strong>
          <span>閱讀市場燈號、分數與風險提示，建立固定觀察流程。</span>
        </li>
        <li>
          <strong>目前不宣稱</strong>
          <span>不宣稱即時真實行情、完整市場覆蓋、正式模型分數或買賣建議。</span>
        </li>
        <li>
          <strong>正式資料切換條件</strong>
          <span>需完成合法來源、資料品質、寫入驗證、讀回驗證、回復計畫與正式資料切換檢查。</span>
        </li>
      </ul>
      <p className="public-data-source-boundary-notice__footnote">
        若資料異常或尚未更新，前台會以資料狀態提示使用者，不把示範資料包裝成正式資料。
      </p>
    </section>
  );
}
