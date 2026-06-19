"use client";

import { useMemo, useRef, useState } from "react";

export type StockQuoteChartPoint = {
  close: number;
  compositeScore: number;
  date: string;
  riskScore: number;
};

type StockQuoteInteractiveChartProps = {
  assetName: string;
  points: StockQuoteChartPoint[];
  unit: string;
};

const ranges = [
  { days: 30, label: "近 30 日" },
  { days: 60, label: "近 60 日" },
  { days: 90, label: "近 90 日" }
];

export function StockQuoteInteractiveChart({ assetName, points, unit }: StockQuoteInteractiveChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [rangeDays, setRangeDays] = useState(60);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const visiblePoints = useMemo(() => points.slice(-rangeDays), [points, rangeDays]);
  const geometry = useMemo(() => buildLineGeometry(visiblePoints), [visiblePoints]);
  const activePoint = activeIndex == null ? visiblePoints.at(-1) : visiblePoints[activeIndex];
  const activeGeometryPoint = activeIndex == null ? geometry.points.at(-1) : geometry.points[activeIndex];

  function handlePointerMove(clientX: number) {
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect || visiblePoints.length === 0) return;
    const viewBoxX = ((clientX - rect.left) / rect.width) * 720;
    const nearest = geometry.points.reduce(
      (best, point, index) => {
        const distance = Math.abs(point.x - viewBoxX);
        return distance < best.distance ? { distance, index } : best;
      },
      { distance: Number.POSITIVE_INFINITY, index: 0 }
    );
    setActiveIndex(nearest.index);
  }

  return (
    <>
      <div className="stock-quote-range" aria-label="切換報價圖表時間範圍">
        {ranges.map((range) => (
          <button
            aria-pressed={range.days === rangeDays}
            className={range.days === rangeDays ? "active" : undefined}
            key={range.days}
            onClick={() => {
              setRangeDays(range.days);
              setActiveIndex(null);
            }}
            type="button"
          >
            {range.label}
          </button>
        ))}
        <span>滑過折線可查看當日收盤與分數。</span>
      </div>

      <div className="stock-quote-chart" aria-label={`${assetName} 收盤價走勢圖`}>
        <svg
          onPointerLeave={() => setActiveIndex(null)}
          onPointerMove={(event) => handlePointerMove(event.clientX)}
          onTouchMove={(event) => {
            const touch = event.touches[0];
            if (touch) handlePointerMove(touch.clientX);
          }}
          ref={svgRef}
          role="img"
          viewBox="0 0 720 220"
        >
          <path className="stock-quote-grid-line" d="M40 38 H700" />
          <path className="stock-quote-grid-line" d="M40 96 H700" />
          <path className="stock-quote-grid-line" d="M40 154 H700" />
          <path className="stock-quote-area" d={geometry.areaPath} />
          <path className="stock-quote-line" d={geometry.linePath} />
          {activeGeometryPoint && (
            <>
              <path className="stock-quote-hover-line" d={`M${activeGeometryPoint.x.toFixed(1)} 26 V186`} />
              <circle cx={activeGeometryPoint.x} cy={activeGeometryPoint.y} r="5" />
            </>
          )}
          <text x="42" y="30">{geometry.highLabel}</text>
          <text x="42" y="180">{geometry.lowLabel}</text>
          <text x="590" y={(activeGeometryPoint?.y ?? geometry.points.at(-1)?.y ?? 120) - 10}>收盤</text>
        </svg>

        {activePoint && activeGeometryPoint && (
          <div
            className="stock-quote-tooltip"
            style={{
              left: `${Math.min(84, Math.max(4, (activeGeometryPoint.x / 720) * 100))}%`,
              top: `${Math.min(72, Math.max(8, (activeGeometryPoint.y / 220) * 100))}%`
            }}
          >
            <strong>{activePoint.date}</strong>
            <span>
              收盤 {formatMarketNumber(activePoint.close)} {unit}
            </span>
            <span>綜合分數 {activePoint.compositeScore}/100</span>
            <span>風險分數 {activePoint.riskScore}/100</span>
          </div>
        )}
      </div>
    </>
  );
}

function buildLineGeometry(points: StockQuoteChartPoint[]) {
  const values = points.map((point) => point.close);
  const fallbackValues = values.length ? values : [0];
  const width = 660;
  const height = 160;
  const left = 40;
  const top = 26;
  const min = Math.min(...fallbackValues);
  const max = Math.max(...fallbackValues);
  const span = max - min || 1;
  const geometryPoints = fallbackValues.map((value, index) => ({
    x: left + (fallbackValues.length === 1 ? width : (index / (fallbackValues.length - 1)) * width),
    y: top + height - ((value - min) / span) * height
  }));
  const linePath = geometryPoints
    .map((point, index) => `${index === 0 ? "M" : "L"}${point.x.toFixed(1)} ${point.y.toFixed(1)}`)
    .join(" ");
  const areaPath = `${linePath} L${geometryPoints.at(-1)!.x.toFixed(1)} ${top + height} L${geometryPoints[0].x.toFixed(
    1
  )} ${top + height} Z`;

  return {
    areaPath,
    highLabel: formatMarketNumber(max),
    linePath,
    lowLabel: formatMarketNumber(min),
    points: geometryPoints
  };
}

function formatMarketNumber(value: number) {
  return value.toLocaleString("zh-TW", { maximumFractionDigits: 2, minimumFractionDigits: 2 });
}
