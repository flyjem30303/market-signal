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
    ariaLabel: "今日簡報下一步",
    body: "先看市場總覽，再回到個別標的確認風險來源，最後閱讀方法說明與免責資訊。",
    eyebrow: "下一步",
    eventName: "briefing_link_clicked",
    title: "把今日燈號拆成可追蹤的觀察順序"
  },
  home: {
    ariaLabel: "首頁下一步",
    body: "首頁提供 30 秒市場狀態。若需要更多脈絡，可以進入今日簡報、週報或個別標的頁。",
    eyebrow: "下一步",
    eventName: "home_cta_clicked",
    title: "從總覽進入更完整的市場閱讀"
  },
  stock: {
    ariaLabel: "標的頁下一步",
    body: "標的頁適合確認單一指數、ETF 或股票的燈號，再回到簡報與週報比對市場背景。",
    eyebrow: "下一步",
    eventName: "stock_link_clicked",
    title: "把單一標的放回市場脈絡中判讀"
  },
  weekly: {
    ariaLabel: "週報下一步",
    body: "週報適合整理一週變化。接著可回到今日簡報，確認當前燈號是否延續或轉弱。",
    eyebrow: "下一步",
    eventName: "weekly_link_clicked",
    title: "從一週脈絡回到今日判讀"
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
      { href: "/disclaimer", label: "免責聲明", target: "disclaimer" }
    ];
  }

  if (context === "weekly") {
    return [
      { href: "/", label: "市場總覽", target: "home" },
      { href: "/briefing", label: "今日簡報", target: "briefing" },
      { href: stockHref, label: "標的燈號", target: "stock" },
      { href: "/methodology", label: "方法說明", target: "methodology" },
      { href: "/disclaimer", label: "免責聲明", target: "disclaimer" }
    ];
  }

  return [
    { href: "/briefing", label: "今日簡報", target: "briefing" },
    { href: "/weekly", label: "市場週報", target: "weekly" },
    { href: stockHref, label: "標的燈號", target: "stock" },
    { href: "/methodology", label: "方法說明", target: "methodology" },
    { href: "/disclaimer", label: "免責聲明", target: "disclaimer" }
  ];
}
