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
    ariaLabel: "市場摘要延伸閱讀",
    body: "看完市場摘要後，可以回到總覽、查看標的燈號，或確認方法與風險聲明。",
    eyebrow: "下一步",
    eventName: "briefing_link_clicked",
    title: "把市場狀態接到下一個判斷"
  },
  home: {
    ariaLabel: "首頁延伸閱讀",
    body: "先用總覽掌握市場氛圍，再進一步查看摘要、標的燈號與方法說明。",
    eyebrow: "下一步",
    eventName: "home_cta_clicked",
    title: "從總覽進入更完整的觀察流程"
  },
  stock: {
    ariaLabel: "標的頁延伸閱讀",
    body: "標的燈號適合搭配市場摘要與方法說明一起看，避免只用單一分數做判斷。",
    eyebrow: "下一步",
    eventName: "stock_link_clicked",
    title: "把單一標的放回市場脈絡"
  },
  weekly: {
    ariaLabel: "週報延伸閱讀",
    body: "週報適合回看變化脈絡，再回到市場總覽與標的燈號確認目前狀態。",
    eyebrow: "下一步",
    eventName: "weekly_link_clicked",
    title: "從週期回顧回到今日觀察"
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
      { href: "/weekly", label: "週報回顧", target: "weekly" },
      { href: "/methodology", label: "方法說明", target: "methodology" },
      { href: "/disclaimer", label: "風險聲明", target: "disclaimer" }
    ];
  }

  if (context === "weekly") {
    return [
      { href: "/", label: "市場總覽", target: "home" },
      { href: "/briefing", label: "市場摘要", target: "briefing" },
      { href: stockHref, label: "標的燈號", target: "stock" },
      { href: "/methodology", label: "方法說明", target: "methodology" },
      { href: "/disclaimer", label: "風險聲明", target: "disclaimer" }
    ];
  }

  return [
    { href: "/briefing", label: "市場摘要", target: "briefing" },
    { href: "/weekly", label: "週報回顧", target: "weekly" },
    { href: stockHref, label: "標的燈號", target: "stock" },
    { href: "/methodology", label: "方法說明", target: "methodology" },
    { href: "/disclaimer", label: "風險聲明", target: "disclaimer" }
  ];
}
