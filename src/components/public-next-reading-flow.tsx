import { TrackedLink } from "@/components/tracked-link";
import type { TrackingEventName } from "@/lib/tracking";

type PublicNextReadingFlowContext = "briefing" | "home" | "stock" | "weekly";

type PublicNextReadingFlowProps = {
  context: PublicNextReadingFlowContext;
  stockSymbol?: string;
};

type LinkItem = {
  href: string;
  label: string;
  target: string;
};

const contextCopy = {
  briefing: {
    ariaLabel: "簡報下一步閱讀",
    body: "先用簡報確認市場氣氛，再進入標的頁、週報、方法說明與風險聲明，完成今天的觀察流程。",
    eyebrow: "下一步閱讀",
    eventName: "briefing_link_clicked",
    title: "從 30 秒快讀延伸到 3 分鐘判斷"
  },
  home: {
    ariaLabel: "首頁下一步閱讀",
    body: "首頁先給市場總覽；如果需要更多脈絡，請進入市場簡報、個股頁、週報與方法說明。",
    eyebrow: "下一步閱讀",
    eventName: "home_cta_clicked",
    title: "先看市場燈號，再看成因與資料狀態"
  },
  stock: {
    ariaLabel: "標的頁下一步閱讀",
    body: "單一標的需要放回市場背景一起看。請回到市場簡報，並確認方法說明與風險聲明。",
    eyebrow: "下一步閱讀",
    eventName: "stock_link_clicked",
    title: "不要只看單一標的分數"
  },
  weekly: {
    ariaLabel: "週報下一步閱讀",
    body: "週報用來回看趨勢與風險變化；若要做今日判斷，請回到市場簡報與標的頁。",
    eyebrow: "下一步閱讀",
    eventName: "weekly_link_clicked",
    title: "從一週回看回到今日觀察"
  }
} satisfies Record<
  PublicNextReadingFlowContext,
  {
    ariaLabel: string;
    body: string;
    eyebrow: string;
    eventName: TrackingEventName;
    title: string;
  }
>;

export function PublicNextReadingFlow({ context, stockSymbol = "TWII" }: PublicNextReadingFlowProps) {
  const copy = contextCopy[context];
  const links = getLinks(context, stockSymbol);

  return (
    <section className="panel next-reading-panel" aria-label={copy.ariaLabel}>
      <div>
        <p className="eyebrow">{copy.eyebrow}</p>
        <h2>{copy.title}</h2>
        <p>{copy.body}</p>
      </div>
      <nav className="experience-flow-nav" aria-label={`${copy.ariaLabel}連結`}>
        <span>建議順序</span>
        {links.map((link) => (
          <TrackedLink
            eventName={copy.eventName}
            href={link.href}
            key={`${context}-${link.href}`}
            label={link.label}
            payload={{ area: "experience_flow", context, target: link.target }}
          >
            {link.label}
          </TrackedLink>
        ))}
      </nav>
    </section>
  );
}

function getLinks(context: PublicNextReadingFlowContext, stockSymbol: string): LinkItem[] {
  const stockHref = `/stocks/${stockSymbol}`;

  if (context === "briefing") {
    return [
      { href: "/", label: "市場總覽", target: "home" },
      { href: stockHref, label: "核心標的", target: "stock" },
      { href: "/weekly", label: "週報回看", target: "weekly" },
      { href: "/methodology", label: "方法說明", target: "methodology" },
      { href: "/disclaimer", label: "風險聲明", target: "disclaimer" }
    ];
  }

  if (context === "weekly") {
    return [
      { href: "/", label: "市場總覽", target: "home" },
      { href: "/briefing", label: "市場簡報", target: "briefing" },
      { href: stockHref, label: "核心標的", target: "stock" },
      { href: "/methodology", label: "方法說明", target: "methodology" },
      { href: "/disclaimer", label: "風險聲明", target: "disclaimer" }
    ];
  }

  return [
    { href: "/briefing", label: "市場簡報", target: "briefing" },
    { href: "/weekly", label: "週報回看", target: "weekly" },
    { href: stockHref, label: "核心標的", target: "stock" },
    { href: "/methodology", label: "方法說明", target: "methodology" },
    { href: "/disclaimer", label: "風險聲明", target: "disclaimer" }
  ];
}
