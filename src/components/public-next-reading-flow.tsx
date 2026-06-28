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
    ariaLabel: "市場快報下一步",
    body: "快報保留為支援閱讀頁。核心判讀請回到市場頁，再依需要查看標的或方法說明。",
    eyebrow: "下一步閱讀",
    eventName: "briefing_link_clicked",
    title: "把快報結論接回市場頁脈絡"
  },
  home: {
    ariaLabel: "首頁下一步閱讀",
    body: "先用總覽掌握市場溫度，再進入市場頁理解主要變化，最後進入標的細節。",
    eyebrow: "閱讀流程",
    eventName: "home_cta_clicked",
    title: "從市場溫度進到單一標的"
  },
  stock: {
    ariaLabel: "標的頁下一步閱讀",
    body: "單一標的需要放回市場脈絡中閱讀。請搭配市場頁、方法說明與資料日期判斷。",
    eyebrow: "下一步閱讀",
    eventName: "stock_link_clicked",
    title: "先看市場，再看標的"
  },
  weekly: {
    ariaLabel: "週報下一步閱讀",
    body: "週報回答本週變化。若要看今日狀態，請回到總覽或市場頁。",
    eyebrow: "下一步閱讀",
    eventName: "weekly_link_clicked",
    title: "把本週變化接回今日判讀"
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
        <span>建議閱讀</span>
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
      { href: "/markets/tw", label: "台灣市場", target: "market" },
      { href: stockHref, label: "標的觀察", target: "stock" }
    ];
  }

  if (context === "weekly") {
    return [
      { href: "/", label: "市場總覽", target: "home" },
      { href: "/markets/tw", label: "台灣市場", target: "market" },
      { href: stockHref, label: "標的觀察", target: "stock" }
    ];
  }

  return [
    { href: "/markets/tw", label: "台灣市場", target: "market" },
    { href: stockHref, label: "標的觀察", target: "stock" },
    { href: "/methodology", label: "方法說明", target: "methodology" }
  ];
}
