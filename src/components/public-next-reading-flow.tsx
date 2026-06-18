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
    body: "讀完市場簡報後，可以回首頁看總覽，或進入標的頁查看單一標的狀態。",
    eyebrow: "下一步",
    eventName: "briefing_link_clicked",
    title: "把市場狀態接到下一個觀察動作"
  },
  home: {
    ariaLabel: "首頁下一步",
    body: "先用首頁確認市場氛圍，再到市場簡報或標的頁看原因與風險。",
    eyebrow: "下一步",
    eventName: "home_cta_clicked",
    title: "從總覽進到更完整的市場判讀"
  },
  stock: {
    ariaLabel: "標的頁下一步",
    body: "看完單一標的後，回到市場簡報確認它是否只是個別現象，或已經影響整體市場。",
    eyebrow: "下一步",
    eventName: "stock_link_clicked",
    title: "把標的狀態放回市場脈絡"
  },
  weekly: {
    ariaLabel: "週報下一步",
    body: "週報適合回看趨勢變化；若要看當前狀態，請回首頁或市場簡報。",
    eyebrow: "下一步",
    eventName: "weekly_link_clicked",
    title: "從週報回到今日市場"
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
      { href: stockHref, label: "標的狀態", target: "stock" },
      { href: "/methodology", label: "方法說明", target: "methodology" }
    ];
  }

  if (context === "weekly") {
    return [
      { href: "/", label: "市場總覽", target: "home" },
      { href: "/briefing", label: "市場簡報", target: "briefing" },
      { href: stockHref, label: "標的狀態", target: "stock" }
    ];
  }

  return [
    { href: "/briefing", label: "市場簡報", target: "briefing" },
    { href: stockHref, label: "標的狀態", target: "stock" },
    { href: "/methodology", label: "方法說明", target: "methodology" }
  ];
}
