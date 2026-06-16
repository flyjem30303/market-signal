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
    ariaLabel: "市場快報下一步行動",
    body: "看完快報後，建議回到市場總覽確認全局，再進入標的頁或週報查看細節。",
    eyebrow: "下一步行動",
    eventName: "briefing_link_clicked",
    title: "把快報轉成可執行的觀察順序"
  },
  home: {
    ariaLabel: "首頁下一步行動",
    body: "首頁適合先看整體燈號；需要原因時進入市場快報，需要方法時查看方法說明。",
    eyebrow: "下一步行動",
    eventName: "home_cta_clicked",
    title: "從總覽進入更完整的市場判讀"
  },
  stock: {
    ariaLabel: "標的頁下一步行動",
    body: "標的頁用來看單一指數、ETF 或股票的狀態；下一步可回到快報與週報交叉確認。",
    eyebrow: "下一步行動",
    eventName: "stock_link_clicked",
    title: "不要只看單一分數，回到市場脈絡判斷"
  },
  weekly: {
    ariaLabel: "週報下一步行動",
    body: "週報用來整理一週變化；若需要當前摘要，請回到市場快報或首頁。",
    eyebrow: "下一步行動",
    eventName: "weekly_link_clicked",
    title: "把週報結論接回日常觀察流程"
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
      <nav className="experience-flow-nav" aria-label={`${copy.ariaLabel}導覽`}>
        <span>建議閱讀順序</span>
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
      { href: stockHref, label: "標的燈號", target: "stock" },
      { href: "/weekly", label: "市場週報", target: "weekly" },
      { href: "/methodology", label: "方法說明", target: "methodology" },
      { href: "/disclaimer", label: "風險聲明", target: "disclaimer" }
    ];
  }

  if (context === "weekly") {
    return [
      { href: "/", label: "市場總覽", target: "home" },
      { href: "/briefing", label: "市場快報", target: "briefing" },
      { href: stockHref, label: "標的燈號", target: "stock" },
      { href: "/methodology", label: "方法說明", target: "methodology" },
      { href: "/disclaimer", label: "風險聲明", target: "disclaimer" }
    ];
  }

  return [
    { href: "/briefing", label: "市場快報", target: "briefing" },
    { href: "/weekly", label: "市場週報", target: "weekly" },
    { href: stockHref, label: "標的燈號", target: "stock" },
    { href: "/methodology", label: "方法說明", target: "methodology" },
    { href: "/disclaimer", label: "風險聲明", target: "disclaimer" }
  ];
}
