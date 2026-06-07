import { getBlockerReadinessSummary } from "@/lib/blocker-readiness";
import { getNarrowApprovalOutcomeLedger } from "@/lib/narrow-approval-outcome-ledger";
import { getPostReadonlyNextGateQueue } from "@/lib/post-readonly-next-gate-queue";
import { getPostReadonlyRuntimeState } from "@/lib/post-readonly-runtime-state";
import { getProjectProgressSummary } from "@/lib/project-progress-score";
import { getRowCoverageSecondAttemptReadiness } from "@/lib/row-coverage-second-attempt-readiness";
import { getRuntimeReadinessSummary } from "@/lib/runtime-readiness-score";
import { getSourceDepthBlockerSummary } from "@/lib/source-depth-blockers";

export function BriefingPublicBetaGateSummary() {
  const progress = getProjectProgressSummary();
  const runtime = getRuntimeReadinessSummary();
  const postReadonly = getPostReadonlyRuntimeState();
  const nextGateQueue = getPostReadonlyNextGateQueue();
  const rowCoverage = getRowCoverageSecondAttemptReadiness();
  const sourceDepth = getSourceDepthBlockerSummary();
  const blockers = getBlockerReadinessSummary();
  const narrowOutcome = getNarrowApprovalOutcomeLedger();

  const blockerCount =
    nextGateQueue.gateSummary.blockedWaitingEvidenceCount + nextGateQueue.gateSummary.needsRoleReviewCount;

  return (
    <section className="panel briefing-public-beta-gate-summary" aria-label="PM project progress public beta gate summary">
      <div>
        <p className="eyebrow">PM project progress</p>
        <h2>公開 Beta 前的資料與 runtime gate 摘要</h2>
        <p>
          目前公開頁可用來閱讀示範訊號、風險排序與產品流程；正式資料、正式分數與大量資料寫入仍要等獨立
          gate 通過。
        </p>
      </div>

      <div className="briefing-public-beta-gate-grid">
        <article className="ready">
          <span>整體進度</span>
          <strong>{progress.adjustedScore}%</strong>
          <p>{formatPublicText(progress.nextLift)}</p>
        </article>

        <article className="ready">
          <span>Runtime 狀態</span>
          <strong>{runtime.score}%</strong>
          <p>{formatPublicText(runtime.displayHeadline)}</p>
        </article>

        <article className="hold">
          <span>後端證據</span>
          <strong>{postReadonly.objectsReachable} 個物件可讀</strong>
          <p>{formatPublicText(postReadonly.stopLine)}</p>
        </article>

        <article className="blocked">
          <span>覆蓋率缺口</span>
          <strong>
            {rowCoverage.latestAttempt.observedTotalRows}/{rowCoverage.latestAttempt.expectedTotalRows} 筆
          </strong>
          <p>
            仍缺 {rowCoverage.latestAttempt.missingRows} 筆；下一次遠端唯讀檢查必須另行命名、執行後覆核。
          </p>
        </article>

        <article className="blocked">
          <span>來源深度</span>
          <strong>{formatSourceDepthState(sourceDepth.sourceDepthState)}</strong>
          <p>{formatPublicText(sourceDepth.nextAction)}</p>
        </article>

        <article className="hold">
          <span>Blocker Readiness</span>
          <strong>{blockers.closureGapSummary.blockedPromotionCount} 個升級缺口</strong>
          <p>Three blocker checklists are ready for local review；公開升級仍需來源權利、資料品質與模型可信度通過。</p>
        </article>

        <article className={narrowOutcome.allRequiredOutcomesAccepted ? "ready" : "hold"}>
          <span>口頭審核紀錄</span>
          <strong>{narrowOutcome.allRequiredOutcomesAccepted ? "已可進入下一個命名決策" : "仍需等待"}</strong>
          <p>{formatPublicText(narrowOutcome.nextAllowedDecision)}</p>
        </article>

        <article className={blockerCount === 0 ? "ready" : "blocked"}>
          <span>下一個資料 gate</span>
          <strong>{nextGateQueue.gateSummary.localReadyCount} 個本地檢查可用</strong>
          <p>
            仍有 {blockerCount} 個缺口；公開資料與正式分數會維持示範狀態，直到 gate 完整通過。
          </p>
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
    .replaceAll("Supabase readonly", "Supabase 唯讀");
}
