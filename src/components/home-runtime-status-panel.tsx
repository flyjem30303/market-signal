import { TrackedLink } from "@/components/tracked-link";
import { getRuntimeProductSummary } from "@/lib/runtime-product-summary";

type HomeRuntimeStatusPanelProps = {
  selectedSymbol: string;
};

export function HomeRuntimeStatusPanel({ selectedSymbol }: HomeRuntimeStatusPanelProps) {
  const productSummary = getRuntimeProductSummary(selectedSymbol);

  return (
    <section className="home-runtime-status-panel" aria-label="公開版資料狀態">
      <div>
        <p className="eyebrow">資料狀態</p>
        <h2>公開版先讓使用者看懂狀態，再逐步切換正式資料</h2>
        <p>目前可用示範燈號驗證閱讀流程；正式資料切換前，必須完成來源、覆蓋率、品質與降級檢查。</p>
      </div>

      <div className="runtime-product-summary" aria-label="公開版資料摘要">
        {[
          { className: "active", item: productSummary.useNow },
          { className: "blocked", item: productSummary.notLiveYet },
          { className: "readying", item: productSummary.nextGate },
          { className: "active", item: productSummary.readonlyDecision }
        ].map(({ className, item }) => (
          <article className={className} key={item.label}>
            <span>{item.displayLabel}</span>
            <strong>{item.displayTitle}</strong>
            <p>{item.displayBody}</p>
          </article>
        ))}
      </div>

      <article className="home-runtime-status-panel__data">
        <span>資料邊界</span>
        <strong>目前仍是示範資料</strong>
        <p>資料上線前，前台必須清楚顯示更新時間、來源狀態與限制，避免使用者誤判。</p>
      </article>

      <nav aria-label="公開版延伸閱讀">
        <TrackedLink eventName="home_cta_clicked" href={`/stocks/${selectedSymbol}`} label="查看標的燈號" payload={{ area: "home_runtime_status" }}>
          查看標的燈號
        </TrackedLink>
        <TrackedLink eventName="home_cta_clicked" href="/briefing" label="查看市場簡報" payload={{ area: "home_runtime_status" }}>
          查看市場簡報
        </TrackedLink>
        <TrackedLink eventName="trust_link_clicked" href="/methodology" label="查看方法說明" payload={{ area: "home_runtime_status" }}>
          查看方法說明
        </TrackedLink>
      </nav>
    </section>
  );
}
