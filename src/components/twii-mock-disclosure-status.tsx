import type { TwiiLocalDisclosureConsumerOutput } from "@/lib/twii-local-disclosure-consumer";

type TwiiMockDisclosureStatusProps = {
  disclosure: TwiiLocalDisclosureConsumerOutput;
  label?: string;
};

const statusLabels: Record<TwiiLocalDisclosureConsumerOutput["disclosureStatus"], string> = {
  mock_blocked_by_parser_contract: "欄位契約尚未完成",
  mock_not_runtime_ready: "尚未可公開使用",
  mock_ready_for_review: "可供內部覆核",
  mock_waiting_for_rights: "等待來源權利確認",
  mock_waiting_for_staging_schema: "等待資料表結構確認"
};

export function TwiiMockDisclosureStatus({
  disclosure,
  label = "TWII 資料揭露狀態"
}: TwiiMockDisclosureStatusProps) {
  const sourceLabel = disclosure.publicDataSource === "mock" ? "示範資料" : "正式資料";
  const scoreLabel = disclosure.scoreSource === "mock" ? "示範分數" : "正式分數";

  return (
    <section className="twii-mock-disclosure-status readying" aria-label={label}>
      <div>
        <p className="eyebrow">TWII 資料揭露</p>
        <h2>{statusLabels[disclosure.disclosureStatus]}</h2>
        <p>{disclosure.safeSummary}</p>
      </div>
      <article className="blocked">
        <span>正式資料啟用</span>
        <strong>{disclosure.canUseSupabaseRuntime ? "已啟用" : "尚未啟用"}</strong>
        <p>
          公開資料來源為{sourceLabel}；分數來源為{scoreLabel}。
        </p>
      </article>
      <article className="blocked">
        <span>公開宣稱</span>
        <strong>{disclosure.canClaimTwiiCoverage ? "可宣稱" : "不可宣稱"}</strong>
        <p>{disclosure.canShowRealScore ? "可顯示正式分數。" : "正式分數尚未開放顯示。"}</p>
      </article>
    </section>
  );
}
