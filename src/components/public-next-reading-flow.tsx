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
    ariaLabel: "晨報下一步閱讀",
    body: "先看今日市場氣氛，再進入個股或 ETF 頁確認風險原因；若要理解分數與燈號，請接著看方法說明與風險聲明。",
    eyebrow: "下一步閱讀",
    eventName: "briefing_link_clicked",
    title: "從 30 秒總覽延伸到 3 分鐘行動判斷"
  },
  home: {
    ariaLabel: "首頁下一步閱讀",
    body: "如果只想快速掌握市場，先看首頁燈號；若要理解原因，接著進入晨報、個股頁與方法說明。",
    eyebrow: "下一步閱讀",
    eventName: "home_cta_clicked",
    title: "看完市場燈號後，接著確認原因與邊界"
  },
  stock: {
    ariaLabel: "標的頁下一步閱讀",
    body: "看完單一標的後，回到市場晨報確認整體氣氛，再用方法說明與風險聲明校正判讀邊界。",
    eyebrow: "下一步閱讀",
    eventName: "stock_link_clicked",
    title: "把單一標的放回市場脈絡中閱讀"
  },
  weekly: {
    ariaLabel: "週報下一步閱讀",
    body: "週報適合回看趨勢脈絡；若要做今天的觀察順序，請回到晨報或市場總覽。",
    eyebrow: "下一步閱讀",
    eventName: "weekly_link_clicked",
    title: "從週期回看接回今日市場判斷"
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
      { href: "/weekly", label: "本週回看", target: "weekly" },
      { href: "/methodology", label: "方法說明", target: "methodology" },
      { href: "/disclaimer", label: "風險聲明", target: "disclaimer" }
    ];
  }

  if (context === "weekly") {
    return [
      { href: "/", label: "市場總覽", target: "home" },
      { href: "/briefing", label: "今日晨報", target: "briefing" },
      { href: stockHref, label: "核心標的", target: "stock" },
      { href: "/methodology", label: "方法說明", target: "methodology" },
      { href: "/disclaimer", label: "風險聲明", target: "disclaimer" }
    ];
  }

  return [
    { href: "/briefing", label: "今日晨報", target: "briefing" },
    { href: "/weekly", label: "本週回看", target: "weekly" },
    { href: stockHref, label: "核心標的", target: "stock" },
    { href: "/methodology", label: "方法說明", target: "methodology" },
    { href: "/disclaimer", label: "風險聲明", target: "disclaimer" }
  ];
}
