import {
  getPublicBetaSourceCoverageRuntimeLabels,
  type PublicBetaSourceCoverageContext
} from "@/lib/public-beta-source-coverage-runtime-labels";

type PublicBetaSourceCoverageRuntimeLabelsPanelProps = {
  context: PublicBetaSourceCoverageContext;
  stockSymbol?: string;
};

const stateCopy = {
  blocked: "暫停公開",
  checking: "檢查中",
  usable_demo: "展示可用"
} satisfies Record<string, string>;

export function PublicBetaSourceCoverageRuntimeLabelsPanel({
  context,
  stockSymbol = "2330"
}: PublicBetaSourceCoverageRuntimeLabelsPanelProps) {
  const labels = getPublicBetaSourceCoverageRuntimeLabels(context, stockSymbol);

  return (
    <section className="public-beta-source-coverage-runtime" aria-label="Public Beta source coverage runtime labels">
      <div className="public-beta-source-coverage-runtime__summary">
        <p className="eyebrow">Source & Coverage</p>
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

      <div className="public-beta-source-coverage-runtime__field-contracts" aria-label="Source field contract status">
        {labels.fieldContracts.map((contract) => (
          <article key={contract.id}>
            <span>{contract.status}</span>
            <strong>{contract.label}</strong>
            <p>{contract.detail}</p>
          </article>
        ))}
      </div>

      <div className="public-beta-source-coverage-runtime__index-checks" aria-label="Index baseline mock runtime checks">
        {labels.indexBaselineChecks.map((check) => (
          <article key={check.id}>
            <span>{check.status}</span>
            <strong>{check.label}</strong>
            <p>{check.detail}</p>
          </article>
        ))}
      </div>

      <div className="public-beta-source-coverage-runtime__batch1-policy" aria-label="Batch 1 listed equity policy labels">
        {labels.batch1PolicyLabels.map((policy) => (
          <article key={policy.id}>
            <span>{policy.status}</span>
            <strong>{policy.label}</strong>
            <p>{policy.detail}</p>
          </article>
        ))}
      </div>

      <div className="public-beta-source-coverage-runtime__actions" aria-label="Source coverage reading actions">
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
          <span>資料來源</span>
          <strong>publicDataSource={labels.boundary.publicDataSource}</strong>
        </article>
        <article>
          <span>分數來源</span>
          <strong>scoreSource={labels.boundary.scoreSource}</strong>
        </article>
        <article>
          <span>公開邊界</span>
          <p>{labels.boundary.stopLine}</p>
        </article>
      </div>
    </section>
  );
}
