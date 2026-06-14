import type { Metadata } from "next";
import { DataFreshnessStrip } from "@/components/data-freshness-strip";
import { PageViewTracker } from "@/components/page-view-tracker";
import { PublicBetaMembershipMvpRoadmap } from "@/components/public-beta-membership-mvp-roadmap";
import { PublicBetaPublicStatusSurface } from "@/components/public-beta-public-status-surface";
import { PublicBetaSourceCoverageBridge } from "@/components/public-beta-source-coverage-bridge";
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
  description: "每日市場晨報，協助使用者用 30 秒看懂今日市場氣氛，並用 3 分鐘做行動判斷。"
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
  const breadth = buildBreadth(snapshots);

  return (
    <main className="page-shell">
      <PageViewTracker eventName="briefing_page_viewed" payload={{ page: "briefing" }} />
      <section className="hero briefing-hero">
        <p className="eyebrow">每日市場晨報</p>
        <h1>30 秒看懂今日市場氣氛，3 分鐘行動判斷</h1>
        <p>
          這個頁面把市場總覽、主要風險、資料狀態與下一步觀察整理在一起，協助使用者判斷今天是關注、加強觀察，還是先降低風險。
        </p>
        <p className="runtime-boundary-line">正式市場資料尚未啟用；目前公開 Beta 使用示範資料，不提供買賣建議，也不提供個股買賣建議。</p>
      </section>

      <DataFreshnessStrip freshness={freshness} marketSignalSourceStatus={marketSignalSourceStatus} />
      <PublicBetaPublicStatusSurface />
      <PublicBetaSourceCoverageBridge context="briefing" />
      <section className="panel stock-reading-summary" aria-label="三分鐘判斷順序">
        <p className="eyebrow">3 分鐘判斷順序</p>
        <h2>把市場氣氛、成因與資料品質串成同一個閱讀流程</h2>
        <p>
          先看市場總覽，再看風險提示與資料來源；若資料狀態仍需複核，下一步觀察以等待確認與回看趨勢為主。
        </p>
      </section>

      <section className="briefing-market-action-summary" aria-label="市場行動摘要">
        <div>
          <p className="eyebrow">市場行動摘要</p>
          <h2>{market.signal.title}</h2>
          <p>{market.signal.text}</p>
          <p>
            市場廣度：偏多 {breadth.constructive}、觀望 {breadth.watch}、警戒 {breadth.defensive}。先看市場氣氛，再看主要風險。
          </p>
        </div>
        <TrackedLink
          className="active"
          eventName="briefing_link_clicked"
          href={`/stocks/${market.asset.symbol}`}
          label="查看市場總覽"
          payload={{ area: "briefing_primary", symbol: market.asset.symbol }}
        >
          <span>公開使用狀態</span>
          <strong>{market.asset.name}</strong>
          <p>查看市場燈號、資料信任與警示提醒。</p>
        </TrackedLink>
        <TrackedLink
          className={topRisk.riskScore >= 60 ? "blocked" : "hold"}
          eventName="briefing_link_clicked"
          href={`/stocks/${topRisk.asset.symbol}`}
          label="查看主要風險"
          payload={{ area: "briefing_risk", symbol: topRisk.asset.symbol }}
        >
          <span>今日市場提醒</span>
          <strong>
            {topRisk.asset.symbol} {topRisk.asset.name}
          </strong>
          <p>風險分數 {topRisk.riskScore}/100，請先複核資料狀態與風險原因。</p>
        </TrackedLink>
      </section>

      <section className="home-public-beta-layers briefing-alert-decision-list" aria-label="三分鐘行動判斷">
        <div className="home-public-beta-layer alerts">
          <span>3 分鐘行動判斷</span>
          <strong>先市場、再風險、最後資料</strong>
          <p>若市場氣氛與風險分數互相矛盾，先等待更多資料，不把示範燈號當成交易指令。</p>
        </div>
        <div className="home-public-beta-alert-list">
          <BriefingCard title="市場燈號" value={market.signal.title} text={market.signal.text} href={`/stocks/${market.asset.symbol}`} />
          <BriefingCard title="今日市場提醒" value={`${topRisk.riskScore}/100`} text={`${topRisk.asset.name} 是目前較需要複核的示範標的。`} href={`/stocks/${topRisk.asset.symbol}`} />
          <BriefingCard title="資料狀態" value="示範資料" text="正式市場資料尚未啟用；資料來源與覆蓋率通過前不宣稱即時資料。" href="/methodology" />
        </div>
      </section>

      <section className="panel public-data-readiness-summary" aria-label="資料準備狀態">
        <p className="eyebrow">資料品質</p>
        <h2>目前資料可以怎麼使用</h2>
        <p>
          30 秒可用：先用示範燈號理解今日市場氣氛。3 分鐘要複核：再看資料狀態、正式資料升級前檢查、來源可用條件、欄位與覆蓋率、回退與公開說明。
        </p>
        <p>正式資料尚未啟用；目前內容不能當成買賣指令。</p>
      </section>

      <section className="weekly-grid">
        <BriefingList title="偏強觀察" description="綜合分數較高，適合先回看成因與資料狀態。" items={strongest} valueKey="composite" />
        <BriefingList title="風險觀察" description="風險分數較高，適合先確認是否需要加強觀察。" items={[topRisk]} valueKey="risk" />
      </section>

      <PublicNextReadingFlow context="briefing" stockSymbol={market.asset.symbol} />
      <section className="panel stock-reading-summary" aria-label="會員功能預覽">
        <p className="eyebrow">會員功能預覽</p>
        <h2>第二階段再把市場晨報延伸成會員追蹤流程</h2>
        <p>
          第一階段先讓所有使用者看懂市場燈號、風險提示與資料更新狀態。會員 MVP
          會在公開 Beta 穩定後補上每日市場三層解讀、watchlist 與自訂警示、盤後複盤報告；目前不開放會員登入、付費或個人化資料儲存。
        </p>
      </section>
      <PublicBetaMembershipMvpRoadmap />

      <article className="disclaimer">
        <h2>使用提醒</h2>
        <p>本頁是市場資訊整理與風險辨識工具，不提供買賣建議、不提供個股買賣建議，也不保證報酬。</p>
      </article>
    </main>
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

function buildBreadth(snapshots: SignalSnapshot[]) {
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
