export function BriefingPublicBetaGateSummary() {
  return (
    <section className="panel briefing-public-beta-gate-summary" aria-label="公開版使用狀態摘要">
      <div>
        <p className="eyebrow">公開版使用狀態</p>
        <h2>目前可用來理解市場燈號與閱讀流程</h2>
        <p>
          本摘要只保留使用者需要知道的內容：目前能看市場燈號、風險提示與更新狀態；正式資料與進階功能會在後續 gate 通過後才開放。
        </p>
      </div>

      <div className="briefing-public-beta-gate-grid">
        <article className="ready">
          <span>30 秒快讀</span>
          <strong>市場狀態可閱讀</strong>
          <p>使用者可以快速看到市場目前偏多、觀望或警戒。</p>
        </article>

        <article className="ready">
          <span>3 分鐘判斷</span>
          <strong>風險來源可追蹤</strong>
          <p>頁面會引導使用者從市場總覽進入標的、方法與風險聲明。</p>
        </article>

        <article className="hold">
          <span>資料狀態</span>
          <strong>仍是示範資料</strong>
          <p>正式資料必須等來源權利、覆蓋率與品質 gate 通過。</p>
        </article>

        <article className="hold">
          <span>後續功能</span>
          <strong>不放入 Phase 1 主流程</strong>
          <p>Phase 1 先把公開免費版做好，不在頁面上承諾尚未完成的功能。</p>
        </article>
      </div>

      <footer className="briefing-public-beta-gate-footer">
        <strong>使用提醒</strong>
        <p>目前內容是市場資訊整理與風險辨識輔助，不提供個股買賣建議或保證報酬。</p>
      </footer>
    </section>
  );
}
