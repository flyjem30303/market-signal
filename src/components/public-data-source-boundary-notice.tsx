type PublicDataSourceBoundaryNoticeProps = {
  context: "home" | "briefing" | "stock";
};

const contextCopy = {
  home: {
    title: "目前是公開 Beta 示範資料",
    lead: "首頁用來建立市場閱讀流程，協助使用者在短時間內理解市場氣氛、主要風險與資料更新狀態。"
  },
  briefing: {
    title: "市場快報仍維持資訊整理定位",
    lead: "快報用來整理市場狀態、風險來源與下一步觀察重點，不提供買賣指令或保證報酬。"
  },
  stock: {
    title: "標的頁目前是示範閱讀介面",
    lead: "標的頁用來說明燈號、基本資料、風險來源與資料限制；正式資料上線前不宣稱即時報價。"
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
          <span>Phase 1 仍以 mock 資料驗證閱讀流程，正式資料需要完成來源、品質、寫入回讀與回退檢查。</span>
        </li>
        <li>
          <strong>不是投資建議</strong>
          <span>燈號協助整理市場狀態與觀察順序，不代替使用者做投資決策。</span>
        </li>
        <li>
          <strong>正式資料仍需 gate</strong>
          <span>只有合法來源、資料品質、寫入/readback、rollback 與 promotion gate 都通過後，才會切換真實資料。</span>
        </li>
      </ul>
      <p className="public-data-source-boundary-notice__footnote">
        若資料異常或尚未更新，前台應清楚顯示狀態，避免使用者誤判。
      </p>
    </section>
  );
}
