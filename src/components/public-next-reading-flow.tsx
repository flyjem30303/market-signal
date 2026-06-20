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
    body: "看完總體狀態後，可回到市場總覽比對燈號，或進入標的頁查看單一標的的風險與資料日期。",
    eyebrow: "下一步",
    eventName: "briefing_link_clicked",
    title: "把市場結論接到可檢查的標的資訊"
  },
  home: {
    ariaLabel: "首頁下一步",
    body: "先用總覽掌握市場溫度，再用快報理解主要變化，最後進入標的頁檢查分數、資料日期與風險提示。",
    eyebrow: "閱讀流程",
    eventName: "home_cta_clicked",
    title: "從市場燈號到單一標的"
  },
  stock: {
    ariaLabel: "標的頁下一步",
    body: "單一標的分數需要放回市場環境一起看。請搭配市場快報、方法說明與資料更新列判讀。",
    eyebrow: "下一步",
    eventName: "stock_link_clicked",
    title: "回到市場脈絡確認判讀"
  },
  weekly: {
    ariaLabel: "週報下一步",
    body: "週報適合做趨勢回顧；需要當前市場狀態時，請回到總覽或市場快報。",
    eyebrow: "下一步",
    eventName: "weekly_link_clicked",
    title: "從週期回顧回到即時觀察"
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
      { href: stockHref, label: "標的觀察", target: "stock" },
      { href: "/methodology", label: "方法說明", target: "methodology" }
    ];
  }

  if (context === "weekly") {
    return [
      { href: "/", label: "市場總覽", target: "home" },
      { href: "/briefing", label: "市場快報", target: "briefing" },
      { href: stockHref, label: "標的觀察", target: "stock" }
    ];
  }

  return [
    { href: "/briefing", label: "市場快報", target: "briefing" },
    { href: stockHref, label: "標的觀察", target: "stock" },
    { href: "/methodology", label: "方法說明", target: "methodology" }
  ];
}
