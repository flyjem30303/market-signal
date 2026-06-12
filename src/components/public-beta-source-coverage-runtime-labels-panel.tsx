import {
  getPublicBetaSourceCoverageRuntimeLabels,
  type PublicBetaSourceCoverageContext
} from "@/lib/public-beta-source-coverage-runtime-labels";

type PublicBetaSourceCoverageRuntimeLabelsPanelProps = {
  context: PublicBetaSourceCoverageContext;
  stockSymbol?: string;
};

const stateCopy = {
  blocked: "待補齊",
  checking: "確認中",
  usable_demo: "示範可讀"
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
