export function PublicBetaDataReadinessStatus() {
  return (
    <section className="public-beta-data-readiness-status" aria-label="公開 Beta 資料準備狀態">
      <div className="public-beta-data-readiness-status-main">
        <p className="eyebrow">資料準備狀態</p>
        <h2>正式資料仍在準備，公開頁目前先維持示範資料</h2>
        <p>
          目前頁面已能呈現市場燈號、風險提示與閱讀流程；正式資料來源、覆蓋率與更新流程確認前，不宣稱即時行情或完整市場覆蓋。
        </p>
        <p>使用者應先看資料更新時間與資料邊界，再解讀燈號與分數。</p>
      </div>
      <div className="public-beta-data-actionability" aria-label="目前可閱讀內容">
        <article className="active">
          <span>公開頁</span>
          <strong>可閱讀</strong>
        </article>
        <article className="readying">
          <span>資料覆蓋</span>
          <strong>仍在補齊</strong>
        </article>
        <article className="blocked">
          <span>正式資料</span>
          <strong>尚未啟用</strong>
        </article>
      </div>
      <div className="public-beta-data-upgrade-readiness" aria-label="正式資料升級條件">
        <p className="eyebrow">正式資料升級條件</p>
        <article className="readying">
          <span>來源權利</span>
          <strong>需確認可合法自動化使用</strong>
        </article>
        <article className="readying">
          <span>覆蓋率</span>
          <strong>需完成資料範圍與缺漏處理</strong>
        </article>
        <article className="readying">
          <span>前台揭露</span>
          <strong>需清楚顯示來源、更新時間與延遲</strong>
        </article>
      </div>
    </section>
  );
}
