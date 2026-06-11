import { getPostReadonlyRuntimeState } from "@/lib/post-readonly-runtime-state";
import { getProjectProgressSummary } from "@/lib/project-progress-score";
import { getRowCoverageSecondAttemptReadiness } from "@/lib/row-coverage-second-attempt-readiness";
import { getRuntimeReadinessSummary } from "@/lib/runtime-readiness-score";
import { getSourceDepthBlockerSummary } from "@/lib/source-depth-blockers";

export function BriefingPublicBetaGateSummary() {
  const progress = getProjectProgressSummary();
  const runtime = getRuntimeReadinessSummary();
  const postReadonly = getPostReadonlyRuntimeState();
  const rowCoverage = getRowCoverageSecondAttemptReadiness();
  const sourceDepth = getSourceDepthBlockerSummary();

  return (
    <section className="panel briefing-public-beta-gate-summary" aria-label="Public Beta data readiness summary">
      <div>
        <p className="eyebrow">資料可信度摘要</p>
        <h2>目前可閱讀市場狀態，但尚未升級正式資料</h2>
        <p>
          這個區塊只用一般投資者需要知道的語言說明：目前哪些資料可當示範閱讀、哪些缺口會影響信心，
          以及為什麼公開頁仍維持 mock-only。
        </p>
      </div>

      <div className="briefing-public-beta-gate-grid">
        <article className="ready">
          <span>公開 Beta 可讀度</span>
          <strong>{progress.adjustedScore}%</strong>
          <p>首頁、晨報與主要標的頁可用來理解產品閱讀流程；正式資料升級仍分開處理。</p>
        </article>

        <article className="ready">
          <span>示範系統穩定度</span>
          <strong>{runtime.score}%</strong>
          <p>{formatPublicText(runtime.displayHeadline)}</p>
        </article>

        <article className="hold">
          <span>後端證據</span>
          <strong>{postReadonly.objectsReachable} 個物件可讀</strong>
          <p>目前只代表後端物件可讀，還不代表資料完整、品質通過或正式分數啟用。</p>
        </article>

        <article className="blocked">
          <span>覆蓋率缺口</span>
          <strong>
            {rowCoverage.latestAttempt.observedTotalRows}/{rowCoverage.latestAttempt.expectedTotalRows} 筆
          </strong>
          <p>
            仍缺 {rowCoverage.latestAttempt.missingRows} 筆；補齊前不宣稱 Batch 1 完整，也不切換正式資料。
          </p>
        </article>

        <article className="blocked">
          <span>來源深度</span>
          <strong>{formatSourceDepthState(sourceDepth.sourceDepthState)}</strong>
          <p>{formatPublicText(sourceDepth.nextAction)}</p>
        </article>

        <article className="hold">
          <span>資料升級條件</span>
          <strong>來源、品質、覆蓋率仍需通過</strong>
          <p>正式資料上線前，必須確認來源權利、欄位合約、資料品質、更新時間與錯誤回退。</p>
        </article>

        <article className="hold">
          <span>使用者解讀方式</span>
          <strong>先看方向，不當成交易訊號</strong>
          <p>目前適合用來判斷市場氛圍與風險焦點；不適合用來直接做買賣決策。</p>
        </article>

        <article className="blocked">
          <span>公開停止線</span>
          <strong>不宣稱即時或正式分數</strong>
          <p>資料、分數與警示都維持示範狀態，直到覆蓋率、來源與品質檢查都通過。</p>
        </article>
      </div>

      <footer className="briefing-public-beta-gate-footer">
        <strong>停止線</strong>
        <p>
          不執行 SQL、不寫入 Supabase、不匯入市場原始資料、不修改 daily_prices、不輸出 secrets，也不把示範資料或示範分數升級成正式狀態。
        </p>
      </footer>
    </section>
  );
}

function formatSourceDepthState(value: string) {
  if (value === "not_ready") return "尚未就緒";
  return formatPublicText(value);
}

function formatPublicText(value: string) {
  return value
    .replaceAll("publicDataSource=supabase", "正式公開資料")
    .replaceAll("publicDataSource=mock", "示範公開資料")
    .replaceAll("publicDataSource", "公開資料來源")
    .replaceAll("scoreSource=real", "正式分數")
    .replaceAll("scoreSource=mock", "示範分數")
    .replaceAll("scoreSource", "分數來源")
    .replaceAll("mock-only", "示範狀態")
    .replaceAll("Object reachability", "後端物件可讀性")
    .replaceAll("object reachability", "後端物件可讀性")
    .replaceAll("investment advice", "投資建議")
    .replaceAll("real-data promotion", "正式資料升級")
    .replaceAll("Supabase readonly", "後端唯讀檢查")
    .replaceAll("CEO", "產品團隊")
    .replaceAll("PM", "產品團隊")
    .replaceAll("A1/Data", "資料團隊")
    .replaceAll("post-run review", "檢查後覆核")
    .replaceAll("preflight", "事前檢查")
    .replaceAll("gate", "檢查點")
    .replaceAll("blocker", "阻擋點");
}
