import {
  getPublicBetaSourceCoverageRuntimeLabels,
  type PublicBetaSourceCoverageContext
} from "@/lib/public-beta-source-coverage-runtime-labels";

type PublicBetaSourceCoverageRuntimeLabelsPanelProps = {
  context: PublicBetaSourceCoverageContext;
  stockSymbol?: string;
};

const stateCopy = {
  blocked: "尚未放行",
  checking: "確認中",
  usable_demo: "示範可用"
} satisfies Record<string, string>;

const gapStatusCopy = {
  blocked: "暫停",
  candidate: "候選",
  checking: "確認中",
  future: "後續"
} satisfies Record<string, string>;

const etfScopeStatusCopy = {
  checking: "確認中",
  excluded: "暫不納入",
  mock_only: "示範階段"
} satisfies Record<string, string>;

export function PublicBetaSourceCoverageRuntimeLabelsPanel({
  context,
  stockSymbol = "2330"
}: PublicBetaSourceCoverageRuntimeLabelsPanelProps) {
  const labels = getPublicBetaSourceCoverageRuntimeLabels(context, stockSymbol);
  const publicSourceLabel = labels.boundary.publicDataSource === "mock" ? "示範資料" : "正式資料";
  const scoreSourceLabel = labels.boundary.scoreSource === "mock" ? "示範分數" : "正式分數";

  return (
    <section className="public-beta-source-coverage-runtime" aria-label="資料來源與覆蓋率">
      <div className="public-beta-source-coverage-runtime__summary">
        <p className="eyebrow">資料來源與覆蓋率</p>
        <h2>{labels.headline}</h2>
        <p>{labels.summary}</p>
        <p>{labels.userMeaning}</p>
      </div>

      <div className="public-beta-source-coverage-runtime__layers">
        {labels.layers.map((layer) => (
          <article className={layer.state} key={layer.id}>
            <span>{stateCopy[layer.state]}</span>
            <strong>{layer.label}</strong>
            <p>{layer.detail}</p>
            <small>下一步：{layer.next}</small>
          </article>
        ))}
      </div>

      <div className="public-beta-source-coverage-runtime__gap-matrix" aria-label="資料缺口矩陣">
        <p className="eyebrow">資料缺口矩陣</p>
        {labels.coverageGapMatrix.map((item) => (
          <article className={item.status} key={item.id}>
            <span>{gapStatusCopy[item.status]}</span>
            <strong>{item.label}</strong>
            <p>{item.detail}</p>
            <small>下一步：{item.next}</small>
          </article>
        ))}
      </div>

      <div className="public-beta-source-coverage-runtime__etf-scope" aria-label="ETF 市價範圍">
        <p className="eyebrow">ETF 市價範圍</p>
        {labels.etfMarketPriceScope.map((item) => (
          <article className={item.status} key={item.id}>
            <span>{etfScopeStatusCopy[item.status]}</span>
            <strong>{item.label}</strong>
            <p>{item.detail}</p>
          </article>
        ))}
      </div>

      <div className="public-beta-source-coverage-runtime__etf-checks" aria-label="ETF 示範檢查">
        {labels.etfMarketPriceMockChecks.map((check) => (
          <article key={check.id}>
            <span>{check.status}</span>
            <strong>{check.label}</strong>
            <p>{check.detail}</p>
          </article>
        ))}
      </div>

      <div className="public-beta-source-coverage-runtime__field-contracts" aria-label="欄位契約">
        {labels.fieldContracts.map((contract) => (
          <article key={contract.id}>
            <span>{contract.status}</span>
            <strong>{contract.label}</strong>
            <p>{contract.detail}</p>
          </article>
        ))}
      </div>

      <div className="public-beta-source-coverage-runtime__index-checks" aria-label="指數基準檢查">
        {labels.indexBaselineChecks.map((check) => (
          <article key={check.id}>
            <span>{check.status}</span>
            <strong>{check.label}</strong>
            <p>{check.detail}</p>
          </article>
        ))}
      </div>

      <div className="public-beta-source-coverage-runtime__batch1-policy" aria-label="第一批標的政策">
        {labels.batch1PolicyLabels.map((policy) => (
          <article key={policy.id}>
            <span>{policy.status}</span>
            <strong>{policy.label}</strong>
            <p>{policy.detail}</p>
          </article>
        ))}
      </div>

      <div className="public-beta-source-coverage-runtime__actions" aria-label="資料閱讀步驟">
        {labels.readingActions.map((action) => (
          <article key={action.id}>
            <span>{action.label}</span>
            <strong>{action.title}</strong>
            <p>{action.body}</p>
          </article>
        ))}
      </div>

      <div className="public-beta-source-coverage-runtime__boundary">
        <article>
          <span>公開資料來源</span>
          <strong>{publicSourceLabel}</strong>
        </article>
        <article>
          <span>分數來源</span>
          <strong>{scoreSourceLabel}</strong>
        </article>
        <article>
          <span>使用邊界</span>
          <p>{labels.boundary.stopLine}</p>
        </article>
      </div>
    </section>
  );
}
