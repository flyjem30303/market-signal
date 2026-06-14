export function BriefingPublicBetaGateSummary() {
  return (
    <section className="panel briefing-public-beta-gate-summary" aria-label="公開 Beta 使用狀態摘要">
      <div>
        <p className="eyebrow">公開 Beta 使用狀態</p>
        <h2>目前公開頁可閱讀，資料仍以示範狀態呈現</h2>
        <p>
          本摘要只保留使用者需要知道的內容：目前能看市場燈號、風險提示與更新狀態；正式資料與會員功能會在後續階段開放。
        </p>
      </div>

      <div className="briefing-public-beta-gate-grid">
        <article className="ready">
          <span>30 秒可讀</span>
          <strong>市場氣氛清楚</strong>
          <p>使用者可先看市場主燈號、核心指標與今日提醒。</p>
        </article>

        <article className="ready">
          <span>3 分鐘判斷</span>
          <strong>行動順序清楚</strong>
          <p>頁面引導使用者依序看市場氣氛、風險最高標的、資料狀態與下一步閱讀。</p>
        </article>

        <article className="hold">
          <span>資料邊界</span>
          <strong>示範資料</strong>
          <p>正式資料尚未啟用，頁面不宣稱即時真實資料。</p>
        </article>

        <article className="hold">
          <span>會員下一階段</span>
          <strong>會員 MVP 尚未開放</strong>
          <p>登入、付費、自選追蹤與自訂警示仍屬後續實作。</p>
        </article>
      </div>

      <footer className="briefing-public-beta-gate-footer">
        <strong>使用邊界</strong>
        <p>本網站提供市場資訊整理與風險辨識輔助，不提供個股買賣建議，也不保證任何投資結果。</p>
      </footer>
    </section>
  );
}
