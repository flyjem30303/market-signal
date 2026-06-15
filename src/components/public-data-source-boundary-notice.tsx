type PublicDataSourceBoundaryNoticeProps = {
  context: "home" | "briefing" | "stock";
};

const contextCopy = {
  home: {
    title: "資料來源仍在上線前檢查",
    lead: "目前市場畫面先以示範資料呈現閱讀流程；正式資料需完成來源權利、覆蓋率、品質與寫入回讀檢查後才會切換。"
  },
  briefing: {
    title: "快報資料仍屬示範模式",
    lead: "市場快報用來展示燈號、風險與觀察順序；正式資料切換前，不會宣稱即時或完整覆蓋。"
  },
  stock: {
    title: "個股與指數資料仍在驗證",
    lead: "此頁先展示使用者應如何閱讀燈號、原因與資料時間；正式資料需通過上線前檢查。"
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
          <strong>目前可用</strong>
          <span>市場燈號、風險提示、更新時間與閱讀路徑可先被驗證。</span>
        </li>
        <li>
          <strong>目前不可宣稱</strong>
          <span>不得宣稱正式即時資料、完整市場覆蓋或投資建議。</span>
        </li>
        <li>
          <strong>正式資料切換條件</strong>
          <span>合法來源、資料覆蓋率、品質驗證、寫入回讀與公開說明都通過後才會切換。</span>
        </li>
      </ul>
      <p className="public-data-source-boundary-notice__footnote">
        若資料異常或尚未更新，前台需清楚顯示狀態，避免使用者誤判。
      </p>
    </section>
  );
}
