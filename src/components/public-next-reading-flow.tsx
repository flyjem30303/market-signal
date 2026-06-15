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
    ariaLabel: "市場簡報下一步",
    body: "先看總覽判斷市場氛圍，再進入個股燈號、週報與方法說明交叉確認。",
    eyebrow: "下一步",
    eventName: "briefing_link_clicked",
    title: "把市場簡報接到可行動的觀察流程"
  },
  home: {
    ariaLabel: "首頁下一步",
    body: "從首頁掌握整體燈號後，可以進一步查看市場簡報、週報或個別標的狀態。",
    eyebrow: "下一步",
    eventName: "home_cta_clicked",
    title: "從總覽進入更完整的市場脈絡"
  },
  stock: {
    ariaLabel: "個股頁下一步",
    body: "個別標的燈號需要搭配市場簡報與週報一起閱讀，避免只用單一分數做判斷。",
    eyebrow: "下一步",
    eventName: "stock_link_clicked",
    title: "把單一標的放回市場脈絡"
  },
  weekly: {
    ariaLabel: "週報下一步",
    body: "週報適合回看一段期間的變化，再回到市場簡報與個股頁確認目前狀態。",
    eyebrow: "下一步",
    eventName: "weekly_link_clicked",
    title: "從週報回到今日判斷"
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
      { href: stockHref, label: "個股燈號", target: "stock" },
      { href: "/weekly", label: "週報", target: "weekly" },
      { href: "/methodology", label: "方法說明", target: "methodology" },
      { href: "/disclaimer", label: "免責聲明", target: "disclaimer" }
    ];
  }

  if (context === "weekly") {
    return [
      { href: "/", label: "市場總覽", target: "home" },
      { href: "/briefing", label: "市場簡報", target: "briefing" },
      { href: stockHref, label: "個股燈號", target: "stock" },
      { href: "/methodology", label: "方法說明", target: "methodology" },
      { href: "/disclaimer", label: "免責聲明", target: "disclaimer" }
    ];
  }

  return [
    { href: "/briefing", label: "市場簡報", target: "briefing" },
    { href: "/weekly", label: "週報", target: "weekly" },
    { href: stockHref, label: "個股燈號", target: "stock" },
    { href: "/methodology", label: "方法說明", target: "methodology" },
    { href: "/disclaimer", label: "免責聲明", target: "disclaimer" }
  ];
}
