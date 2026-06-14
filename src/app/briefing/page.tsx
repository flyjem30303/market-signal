import type { Metadata } from "next";
import { DataFreshnessStrip } from "@/components/data-freshness-strip";
import { PageViewTracker } from "@/components/page-view-tracker";
import { PublicBetaDataReadinessStatus } from "@/components/public-beta-data-readiness-status";
import { PublicNextReadingFlow } from "@/components/public-next-reading-flow";
import { TrackedLink } from "@/components/tracked-link";
import { getDataFreshnessSnapshot } from "@/lib/data-freshness-source";
import {
  getMarketSignalRepository,
  getMarketSignalSourceStatus
} from "@/lib/repositories/market-signal-repository";
import type { SignalSnapshot } from "@/lib/signal-model";

export const metadata: Metadata = {
  title: "市場簡報",
  description: "用 30 秒看懂目前市場燈號，再用 3 分鐘確認風險來源、觀察重點與下一步閱讀路徑。"
};

export default async function BriefingPage() {
  const repository = getMarketSignalRepository();
  const freshness = await getDataFreshnessSnapshot();
  const marketSignalSourceStatus = getMarketSignalSourceStatus();
  const snapshots = repository
    .getAssets()
    .map((asset) => repository.getSnapshot(asset.symbol, "2026-05-28"))
    .filter((snapshot): snapshot is SignalSnapshot => Boolean(snapshot));
  const market = snapshots.find((item) => item.asset.symbol === "TWII") ?? snapshots[0];
  const topRisk = snapshots.slice().sort((a, b) => b.riskScore - a.riskScore)[0] ?? market;
  const strongest = snapshots.slice().sort((a, b) => b.compositeScore - a.compositeScore).slice(0, 4);
  const breadth = buildMarketBreadth(snapshots);
  const concentration = buildConcentrationSignal(snapshots);
  const playbook = buildBriefingPlaybook(market, topRisk);

  return (
    <main className="page-shell">
      <PageViewTracker eventName="briefing_page_viewed" payload={{ page: "briefing" }} />

      <section className="hero briefing-public-summary" aria-label="市場簡報總覽">
        <p className="eyebrow">市場簡報</p>
        <h1>先看市場燈號，再確認風險來源與觀察順序</h1>
        <p>
          這頁把首頁、個股/指數頁與資料狀態整理成一條閱讀路徑。目標是讓一般投資者先用 30 秒掌握市場氛圍，
          再用 3 分鐘確認是否需要加強觀察、等待更多資料，或降低風險曝險。
        </p>
        <p className="runtime-boundary-line">
          公開 Beta 目前以示範資料呈現燈號與閱讀流程；正式市場資料尚未啟用前，所有分數與燈號只用來理解產品方式，
          不是投資建議，也不是即時行情或個別買賣依據。
        </p>
      </section>

      <section className="briefing-executive-summary" aria-label="30 秒市場重點">
        <div>
          <p className="eyebrow">30 秒市場重點</p>
          <h1>{market.signal.title}</h1>
          <p>
            {market.asset.name} 目前綜合分數為 {market.compositeScore}/100；目前風險分數最高的是{" "}
            {topRisk.asset.name}，風險分數 {topRisk.riskScore}/100。請先把燈號當成觀察排序，
            再回到各指數或 ETF 頁確認原因。
          </p>
          <p className="runtime-boundary-line">
            現階段公開頁仍以示範資料呈現產品流程。正式資料尚未啟用前，燈號只適合用來理解閱讀方式，
            不能作為即時行情或個別買賣依據。
          </p>
        </div>
        <aside>
          <span>
            <b>市場分數</b>
            <i>
              {market.asset.name}: {market.compositeScore}/100
            </i>
          </span>
          <span>
            <b>最高風險</b>
            <i>
              {topRisk.asset.name}: {topRisk.riskScore}/100
            </i>
          </span>
        </aside>
        <div className="briefing-runtime-action-strip">
          <DecisionPill title="先看方向" body="確認市場總覽燈號是偏多、觀望或警戒。" tone="active" />
          <DecisionPill title="再看風險" body="檢查風險分數高的標的與可能原因。" tone="hold" />
          <DecisionPill title="最後複核" body="回到資料更新時間與來源狀態，避免誤判。" tone="blocked" />
        </div>
        <nav aria-label="市場簡報主要連結">
          <TrackedLink
            eventName="briefing_link_clicked"
            href={`/stocks/${market.asset.symbol}`}
            label="查看市場主要燈號"
            payload={{ area: "briefing_summary", symbol: market.asset.symbol }}
          >
            <span>主要燈號</span>
            <strong>{market.asset.name}</strong>
            <small>查看分數、原因與下一步觀察</small>
          </TrackedLink>
          <TrackedLink
            eventName="briefing_link_clicked"
            href={`/stocks/${topRisk.asset.symbol}`}
            label="查看最高風險標的"
            payload={{ area: "briefing_summary", symbol: topRisk.asset.symbol }}
          >
            <span>最高風險</span>
            <strong>{topRisk.asset.name}</strong>
            <small>確認風險來源與觀察重點</small>
          </TrackedLink>
        </nav>
      </section>

      <section className="home-public-beta-layers briefing-alert-decision-list" aria-label="警示清單">
        <div className="home-public-beta-layer alerts">
          <span>警示清單</span>
          <strong>把市場燈號拆成可追蹤的原因，而不是只看單一分數。</strong>
          <p>
            下列卡片協助你先定位市場狀態、風險集中位置與方法說明。正式資料上線前，這些內容代表產品閱讀流程，
            不代表即時市場判斷。
          </p>
        </div>
        <div className="home-public-beta-alert-list">
          <BriefingCard
            href={`/stocks/${market.asset.symbol}`}
            text={`${market.asset.name} 目前是市場總覽的主要參考，適合先看燈號、分數與原因摘要。`}
            title="市場主要燈號"
            value={`${market.compositeScore}/100`}
          />
          <BriefingCard
            href={`/stocks/${topRisk.asset.symbol}`}
            text={`${topRisk.asset.name} 目前風險分數較高，適合進一步確認波動與觀察條件。`}
            title="風險觀察重點"
            value={`${topRisk.riskScore}/100`}
          />
          <BriefingCard
            href="/methodology"
            text="查看燈號如何從趨勢、風險與資料狀態組成，並理解目前 mock/real 邊界。"
            title="方法說明"
            value="閱讀"
          />
        </div>
      </section>

      <DataFreshnessStrip freshness={freshness} marketSignalSourceStatus={marketSignalSourceStatus} />

      <PublicBetaDataReadinessStatus />

      <section className="panel stock-reading-summary" aria-label="正式資料狀態提醒">
        <p className="eyebrow">資料上線提醒</p>
        <h2>正式市場資料尚未啟用，請先看更新時間、來源狀態與資料品質</h2>
        <p>
          目前公開頁仍以示範資料呈現閱讀流程。正式資料完成切換前，所有燈號都應視為市場觀察與風險辨識線索，
          不提供個股買賣建議，也不應直接當成即時市場訊號或交易指令。
        </p>
      </section>

      <section className="panel stock-reading-summary" aria-label="資料邊界">
        <p className="eyebrow">資料邊界</p>
        <h2>正式資料尚未啟用，請先看更新時間與來源狀態</h2>
        <p>
          這個頁面目前用示範資料說明產品流程。資料上線前，請把分數與燈號視為閱讀介面範例；
          資料上線後，頁面會同步顯示來源、更新時間、延遲與異常回退狀態。
        </p>
      </section>

      <section className="briefing-breadth" id="market-structure" aria-label="市場結構">
        <BreadthCard label="偏多" tone="active" value={breadth.constructive} />
        <BreadthCard label="觀望" tone="hold" value={breadth.watch} />
        <BreadthCard label="警戒" tone="blocked" value={breadth.defensive} />
      </section>

      <ConcentrationPanel concentration={concentration} />

      <section className="briefing-playbook" id="briefing-playbook" aria-label="3 分鐘閱讀流程">
        <p className="eyebrow">3 分鐘閱讀流程</p>
        <h2>照順序看三件事：方向、風險、資料狀態</h2>
        <p>
          先確認市場總覽，再看風險集中在哪裡，最後檢查資料更新與來源狀態。這個順序能降低只看單一分數造成的誤判。
        </p>
        <div className="playbook-grid">
          {playbook.map((item) => (
            <article className="playbook-card" key={item.title}>
              <span>{item.step}</span>
              <strong>{item.title}</strong>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="weekly-grid">
        <BriefingList
          description="綜合分數較高的標的可作為市場動能參考，但仍要搭配風險分數與資料狀態一起看。"
          items={strongest}
          title="動能較強"
          valueKey="composite"
        />
        <BriefingList
          description="風險分數較高的標的代表需要優先複核，不代表必然看空或立即採取交易行動。"
          items={[topRisk]}
          title="風險較高"
          valueKey="risk"
        />
      </section>

      <PublicNextReadingFlow context="briefing" stockSymbol={market.asset.symbol} />

      <section className="panel stock-reading-summary" aria-label="使用提醒">
        <p className="eyebrow">使用提醒</p>
        <h2>燈號是觀察輔助，不是投資建議</h2>
        <p>
          指數燈號協助你整理市場狀態、資料更新與風險排序。任何投資決策都應搭配自己的風險承受度、
          投資期限與其他資料來源進行判斷。
        </p>
      </section>
    </main>
  );
}

function DecisionPill({ body, title, tone }: { body: string; title: string; tone: "active" | "hold" | "blocked" }) {
  return (
    <article className={`decision-pill ${tone}`}>
      <strong>{title}</strong>
      <span>{body}</span>
    </article>
  );
}

function BriefingCard({ href, text, title, value }: { href: string; text: string; title: string; value: string }) {
  return (
    <TrackedLink eventName="briefing_link_clicked" href={href} label={title} payload={{ area: "briefing_card", title }}>
      <span>{title}</span>
      <strong>{value}</strong>
      <p>{text}</p>
    </TrackedLink>
  );
}

function BriefingList({
  description,
  items,
  title,
  valueKey
}: {
  description: string;
  items: SignalSnapshot[];
  title: string;
  valueKey: "composite" | "risk";
}) {
  return (
    <article className="panel briefing-article">
      <p className="eyebrow">{title}</p>
      <h2>{title}</h2>
      <p>{description}</p>
      <div className="rank-list">
        {items.map((item) => (
          <TrackedLink
            className="rank-row"
            eventName="briefing_link_clicked"
            href={`/stocks/${item.asset.symbol}`}
            key={item.asset.id}
            label={`${item.asset.symbol} ${item.asset.name}`}
            payload={{ area: title, symbol: item.asset.symbol }}
          >
            <strong>{item.asset.symbol}</strong>
            <span>{item.asset.name}</span>
            <b>{valueKey === "risk" ? item.riskScore : item.compositeScore}</b>
          </TrackedLink>
        ))}
      </div>
    </article>
  );
}

function buildMarketBreadth(snapshots: SignalSnapshot[]) {
  return snapshots.reduce(
    (summary, snapshot) => {
      if (snapshot.compositeScore >= 70) summary.constructive += 1;
      else if (snapshot.riskScore >= 60 || snapshot.compositeScore < 45) summary.defensive += 1;
      else summary.watch += 1;
      return summary;
    },
    { constructive: 0, defensive: 0, watch: 0 }
  );
}

function BreadthCard({
  label,
  tone,
  value
}: {
  label: string;
  tone: "active" | "hold" | "blocked";
  value: number;
}) {
  return (
    <article className={`breadth-card ${tone}`}>
      <span>{label}</span>
      <strong>{value}</strong>
      <p>目前分類數</p>
    </article>
  );
}

function buildConcentrationSignal(snapshots: SignalSnapshot[]) {
  const sorted = snapshots.slice().sort((a, b) => b.riskScore - a.riskScore);
  const top = sorted[0];
  const second = sorted[1];
  const spread = top && second ? top.riskScore - second.riskScore : 0;
  return {
    headline: spread >= 12 ? "風險較集中，請優先確認最高風險標的" : "風險分布較平均，請搭配市場總覽判斷",
    primary: top,
    spread
  };
}

function ConcentrationPanel({
  concentration
}: {
  concentration: ReturnType<typeof buildConcentrationSignal>;
}) {
  return (
    <section className="panel briefing-concentration" aria-label="風險集中度">
      <p className="eyebrow">風險集中度</p>
      <h2>{concentration.headline}</h2>
      <div className="concentration-metrics">
        <article>
          <span>主要風險標的</span>
          <strong>{concentration.primary?.asset.name ?? "-"}</strong>
        </article>
        <article>
          <span>風險分數差距</span>
          <strong>{concentration.spread}</strong>
        </article>
      </div>
    </section>
  );
}

function buildBriefingPlaybook(market: SignalSnapshot, topRisk: SignalSnapshot) {
  return [
    {
      body: `${market.asset.name} 目前顯示「${market.signal.title}」。先確認它代表偏多、觀望或警戒，再看原因摘要。`,
      step: "1",
      title: "確認市場方向"
    },
    {
      body: `${topRisk.asset.name} 是目前風險分數較高的標的。請檢查風險來源、更新時間與是否需要持續觀察。`,
      step: "2",
      title: "找出風險來源"
    },
    {
      body: "最後確認資料是否已更新、來源是否可用，以及目前是否仍停留在示範資料狀態。",
      step: "3",
      title: "複核資料狀態"
    }
  ];
}
