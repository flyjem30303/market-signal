import { getPublicBetaDataReadinessStatus } from "@/lib/public-beta-data-readiness-status";

export function PublicBetaDataReadinessStatus() {
  const status = getPublicBetaDataReadinessStatus();

  return (
    <section className="public-beta-data-readiness-status" aria-label="公開 Beta 資料狀態">
      <div className="public-beta-data-readiness-status-main">
        <p className="eyebrow">資料狀態</p>
        <h2>{status.headline}</h2>
        <p>{status.summary}</p>
        <p>{status.stopLine}</p>
      </div>
      <article className="readying">
        <span>目前可看</span>
        <strong>市場狀態閱讀流程</strong>
        <p>首頁、晨報、週報與標的頁已可示範 30 秒快讀與 3 分鐘觀察順序。</p>
      </article>
      <article className="readying">
        <span>仍在補齊</span>
        <strong>正式資料來源與覆蓋範圍</strong>
        <p>正式資料上線前，會先確認來源可用條件、欄位一致性、更新節奏與資料缺口提示。</p>
      </article>
      <article className="active">
        <span>使用邊界</span>
        <strong>示範資料 / 示範分數</strong>
        <p>正式市場資料尚未啟用；公開頁會明確標示資料限制，避免使用者誤解。</p>
      </article>
      <div className="public-beta-data-actionability" aria-label="目前資料可以怎麼使用">
        <p className="eyebrow">目前資料可以怎麼使用</p>
        <article className="active">
          <span>30 秒可用</span>
          <strong>看市場氣氛與閱讀順序</strong>
          <p>可以用來快速理解強弱、風險與資料品質如何排列，但只代表示範閱讀流程。</p>
        </article>
        <article className="readying">
          <span>3 分鐘要複核</span>
          <strong>先確認成因與資料狀態</strong>
          <p>若燈號偏強或風險升溫，請先看成因、更新時間、來源狀態與風險聲明，再決定是否持續觀察。</p>
        </article>
        <article className="blocked">
          <span>不能直接做</span>
          <strong>不能當成買賣指令</strong>
          <p>正式資料與正式分數啟用前，不能把分數當作交易依據，也不能視為個人化投資建議。</p>
        </article>
      </div>
      <div className="public-beta-data-upgrade-readiness" aria-label="正式資料升級前檢查">
        <p className="eyebrow">正式資料升級前檢查</p>
        <article className="readying">
          <span>升級前檢查 1</span>
          <strong>來源可用條件</strong>
          <p>先確認資料來源可免費、自動化且可公開引用；未確認前不宣稱正式市場資料。</p>
        </article>
        <article className="readying">
          <span>升級前檢查 2</span>
          <strong>欄位與覆蓋率</strong>
          <p>確認交易日、收盤價、代號、更新時間與缺口提示一致後，才擴大資料覆蓋。</p>
        </article>
        <article className="blocked">
          <span>升級前檢查 3</span>
          <strong>回退與公開說明</strong>
          <p>資料延遲、缺漏或異常時，頁面必須能清楚降級，不把示範分數包裝成正式訊號。</p>
        </article>
      </div>
    </section>
  );
}
