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
    body: "看完快報後，先回首頁確認總覽，再進入個別燈號或週報補足脈絡。",
    eyebrow: "下一步",
    eventName: "briefing_link_clicked",
    title: "把市場狀態接到可行動的閱讀順序"
  },
  home: {
    ariaLabel: "首頁下一步",
    body: "首頁先給 30 秒總覽；想看原因時，進入市場快報或個別標的頁。",
    eyebrow: "下一步",
    eventName: "home_cta_clicked",
    title: "從總覽進到原因與風險"
  },
  stock: {
    ariaLabel: "標的頁下一步",
    body: "個別頁看完後，回到快報檢查市場背景，避免只看單一分數。",
    eyebrow: "下一步",
    eventName: "stock_link_clicked",
    title: "不要只看單一燈號"
  },
  weekly: {
    ariaLabel: "週報下一步",
    body: "週報用來回看本週脈絡；下一步可回到快報或個別標的確認目前狀態。",
    eyebrow: "下一步",
    eventName: "weekly_link_clicked",
    title: "把回顧接回今日觀察"
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
      { href: stockHref, label: "查看燈號", target: "stock" },
      { href: "/weekly", label: "公開週報", target: "weekly" },
      { href: "/methodology", label: "方法說明", target: "methodology" },
      { href: "/disclaimer", label: "免責聲明", target: "disclaimer" }
    ];
  }

  if (context === "weekly") {
    return [
      { href: "/", label: "市場總覽", target: "home" },
      { href: "/briefing", label: "市場快報", target: "briefing" },
      { href: stockHref, label: "查看燈號", target: "stock" },
      { href: "/methodology", label: "方法說明", target: "methodology" },
      { href: "/disclaimer", label: "免責聲明", target: "disclaimer" }
    ];
  }

  return [
    { href: "/briefing", label: "市場快報", target: "briefing" },
    { href: "/weekly", label: "公開週報", target: "weekly" },
    { href: stockHref, label: "查看燈號", target: "stock" },
    { href: "/methodology", label: "方法說明", target: "methodology" },
    { href: "/disclaimer", label: "免責聲明", target: "disclaimer" }
  ];
}
