import type { Metadata } from "next";
import { DataFreshnessStrip } from "@/components/data-freshness-strip";
import { PageViewTracker } from "@/components/page-view-tracker";
import { PublicBetaDataReadinessStatus } from "@/components/public-beta-data-readiness-status";
import { PublicBetaMembershipMvpRoadmap } from "@/components/public-beta-membership-mvp-roadmap";
import { PublicBetaPublicStatusSurface } from "@/components/public-beta-public-status-surface";
import { PublicBetaSourceCoverageBridge } from "@/components/public-beta-source-coverage-bridge";
import { PublicBetaUsableLoopPanel } from "@/components/public-beta-usable-loop-panel";
import { PublicNextReadingFlow } from "@/components/public-next-reading-flow";
import { TrackedLink } from "@/components/tracked-link";
import { getDataFreshnessSnapshot } from "@/lib/data-freshness-source";
import {
  getMarketSignalRepository,
  getMarketSignalSourceStatus
} from "@/lib/repositories/market-signal-repository";
import type { SignalSnapshot } from "@/lib/signal-model";

export const metadata: Metadata = {
  title: "市場簡報｜指數燈號",
  description: "用 30 秒看懂市場氛圍，3 分鐘完成風險、趨勢與資料狀態檢查。公開 Beta 目前使用示範資料。"
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

      <section className="briefing-public-summary" aria-label="每日市場晨報">
        <p className="eyebrow">每日市場晨報</p>
        <h1>晨報快速判讀：市場行動摘要</h1>
        <p>
          先用 30 秒看懂今日市場氣氛，再依 3 分鐘判斷順序確認主要風險、成因、資料更新時間與下一步觀察。
          今日市場提醒：3 分鐘再決定觀察順序，不要只看單一分數。
          目前公開頁以示範資料呈現閱讀流程，正式市場資料尚未啟用。
          使用提醒：本頁協助整理市場狀態與風險線索，不提供買進、賣出、持有或個人化投資建議。
        </p>
      </section>

      <section className="briefing-executive-summary" aria-label="市場簡報摘要">
        <div>
          <p className="eyebrow">市場簡報</p>
          <h1>30 秒看懂今日市場氣氛，3 分鐘行動判斷</h1>
          <p>
            目前以 {market.asset.name} 作為市場主燈號，燈號為「{market.signal.title}」；風險最高的觀察標的為{" "}
            {topRisk.asset.name}。本頁把市場狀態、風險集中度、下一步觀察與資料邊界放在同一個閱讀流程中。
            使用方式是 30 秒看市場氣氛，再用 3 分鐘完成風險與資料狀態複核。
          </p>
          <p className="runtime-boundary-line">
            公開 Beta 目前使用示範資料與示範分數，正式資料來源、更新頻率與資料覆蓋率仍在補齊；不提供個股買賣建議。
          </p>
        </div>
        <aside>
          <span>
            <b>市場燈號</b>
            <i>
              {market.asset.name}：{market.compositeScore}/100
            </i>
          </span>
          <span>
            <b>風險觀察</b>
            <i>
              {topRisk.asset.name}：{topRisk.riskScore}/100
            </i>
          </span>
        </aside>
        <div className="briefing-runtime-action-strip">
          <DecisionPill title="先看燈號" body="判斷市場偏多、觀望、警戒或高風險。" tone="active" />
          <DecisionPill title="再看風險" body="確認風險是否集中在少數標的或族群。" tone="hold" />
          <DecisionPill title="最後看資料" body="確認目前資料是否為示範、延遲或正式資料。" tone="blocked" />
        </div>
        <nav aria-label="市場簡報導覽">
          <TrackedLink
            eventName="briefing_link_clicked"
            href={`/stocks/${market.asset.symbol}`}
            label="查看市場主軸"
            payload={{ area: "briefing_summary", symbol: market.asset.symbol }}
          >
            <span>市場主軸</span>
            <strong>{market.asset.name}</strong>
            <small>查看個股/指數頁</small>
          </TrackedLink>
          <TrackedLink
            eventName="briefing_link_clicked"
            href={`/stocks/${topRisk.asset.symbol}`}
            label="查看風險標的"
            payload={{ area: "briefing_summary", symbol: topRisk.asset.symbol }}
          >
            <span>風險觀察</span>
            <strong>{topRisk.asset.name}</strong>
            <small>檢查風險分數</small>
          </TrackedLink>
        </nav>
      </section>

      <section className="home-public-beta-layers briefing-alert-decision-list" aria-label="市場警示清單">
        <div className="home-public-beta-layer alerts">
          <span>今日警示清單</span>
          <strong>把市場狀態、風險集中與資料限制合併成同一個判斷流程</strong>
          <p>本區塊不是買賣建議，而是協助使用者決定是否需要關注、加強觀察或降低風險。</p>
        </div>
        <div className="home-public-beta-alert-list">
          <BriefingCard
            href={`/stocks/${market.asset.symbol}`}
            text={`${market.asset.name} 是目前市場主軸，適合先看大盤燈號與市場廣度。`}
            title="市場主燈號"
            value={`${market.compositeScore}/100`}
          />
          <BriefingCard
            href={`/stocks/${topRisk.asset.symbol}`}
            text={`${topRisk.asset.name} 的風險分數較高，建議檢查波動、集中度與資料時效。`}
            title="風險觀察"
            value={`${topRisk.riskScore}/100`}
          />
          <BriefingCard
            href="/methodology"
            text="了解目前示範資料、燈號邏輯、資料更新時間與非投資建議邊界。"
            title="方法與限制"
            value="說明"
          />
        </div>
      </section>

      <DataFreshnessStrip freshness={freshness} marketSignalSourceStatus={marketSignalSourceStatus} />
      <PublicBetaPublicStatusSurface />
      <PublicBetaDataReadinessStatus />
      <PublicBetaSourceCoverageBridge context="briefing" />
      <PublicBetaUsableLoopPanel context="briefing" stockSymbol={market.asset.symbol} />

      <section className="briefing-breadth" id="market-structure" aria-label="市場廣度">
        <BreadthCard label="偏多" tone="active" value={breadth.constructive} />
        <BreadthCard label="觀望" tone="hold" value={breadth.watch} />
        <BreadthCard label="防守" tone="blocked" value={breadth.defensive} />
      </section>

      <ConcentrationPanel concentration={concentration} />

      <section className="briefing-playbook" id="briefing-playbook" aria-label="三分鐘觀察流程">
        <p className="eyebrow">3 分鐘觀察流程</p>
        <h2>依序檢查燈號、風險與資料，不被單一分數帶著走</h2>
        <p>先理解市場氛圍，再確認風險是否集中，最後檢查資料更新時間與示範資料限制。</p>
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
          description="綜合分數較高，代表示範模型中趨勢、品質與資金條件相對較好。"
          items={strongest}
          title="較強觀察"
          valueKey="composite"
        />
        <BriefingList
          description="風險分數較高，代表估值、波動或資料狀態需要更仔細檢查。"
          items={[topRisk]}
          title="風險觀察"
          valueKey="risk"
        />
      </section>

      <PublicNextReadingFlow context="briefing" stockSymbol={market.asset.symbol} />

      <section className="panel stock-reading-summary" aria-label="會員路線摘要">
        <p className="eyebrow">會員路線</p>
        <h2>第二階段才會導入會員深度解讀與個人化追蹤</h2>
        <p>
          第一階段先把所有人可用的市場總覽、核心燈號、資料揭露與風險聲明完成；第二階段再做會員專區、自選追蹤清單、
          自訂警示與盤後複盤。
        </p>
      </section>
      <PublicBetaMembershipMvpRoadmap />

      <article className="disclaimer">
        <h2>重要聲明</h2>
        <p>本網站提供市場資訊整理與風險辨識，不提供買賣建議、不保證報酬，也不代替使用者做投資決策。</p>
      </article>
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
      <p>代表標的數量</p>
    </article>
  );
}

function buildConcentrationSignal(snapshots: SignalSnapshot[]) {
  const sorted = snapshots.slice().sort((a, b) => b.riskScore - a.riskScore);
  const top = sorted[0];
  const second = sorted[1];
  const spread = top && second ? top.riskScore - second.riskScore : 0;
  return {
    headline: spread >= 12 ? "風險集中在少數標的" : "風險分布相對分散",
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
          <span>風險差距</span>
          <strong>{concentration.spread}</strong>
        </article>
      </div>
    </section>
  );
}

function buildBriefingPlaybook(market: SignalSnapshot, topRisk: SignalSnapshot) {
  return [
    {
      body: `${market.asset.name} 目前為「${market.signal.title}」，先用它建立整體市場氛圍。`,
      step: "1",
      title: "看市場燈號"
    },
    {
      body: `${topRisk.asset.name} 是目前風險分數較高的標的，適合檢查是否為單點風險。`,
      step: "2",
      title: "看風險集中"
    },
    {
      body: "確認目前是否為示範資料、更新時間是否過舊，以及正式資料是否已完成揭露。",
      step: "3",
      title: "看資料邊界"
    }
  ];
}
