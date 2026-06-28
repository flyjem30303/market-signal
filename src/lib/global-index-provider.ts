export type GlobalMarketCode = "US" | "JP" | "KR" | "HK" | "EU" | "CN";

export type GlobalProviderName = "mock";

export type GlobalPublicDataSource = "mock";

export type GlobalIndexRange = "30d" | "90d" | "120d";

export type GlobalIndexSnapshot = {
  symbol: string;
  displayName: string;
  market: GlobalMarketCode;
  country: string;
  regionLabel: string;
  tradeDate: string;
  close: number;
  change: number;
  changePercent: number;
  signalState: string;
  compositeScore: number;
  riskScore: number;
  scoreSource: string;
  riskExplanation: string;
  scoreDrivers: readonly string[];
  riskDrivers: readonly string[];
  mockBoundary: string;
  source: string;
  sourceUrl: string;
  attribution: string;
  isMock: true;
  globalActiveProvider: GlobalProviderName;
  globalPublicDataSource: GlobalPublicDataSource;
};

export type GlobalIndexSeriesPoint = {
  symbol: string;
  tradeDate: string;
  close: number;
  change: number;
  changePercent: number;
  isMock: true;
};

export type GlobalIndexProvider = {
  listMarkets(): Promise<GlobalMarketCode[]>;
  listIndices(market?: GlobalMarketCode): Promise<GlobalIndexSnapshot[]>;
  getIndexSnapshot(symbol: string): Promise<GlobalIndexSnapshot | null>;
  getIndexSeries(symbol: string, range: GlobalIndexRange): Promise<GlobalIndexSeriesPoint[]>;
};

export const globalActiveProvider = "mock" satisfies GlobalProviderName;

export const globalPublicDataSource = "mock" satisfies GlobalPublicDataSource;

export class MockGlobalIndexProvider implements GlobalIndexProvider {
  constructor(
    private readonly snapshots: readonly GlobalIndexSnapshot[],
    private readonly series: Readonly<Record<string, readonly GlobalIndexSeriesPoint[]>>
  ) {}

  async listMarkets() {
    return Array.from(new Set(this.snapshots.map((snapshot) => snapshot.market)));
  }

  async listIndices(market?: GlobalMarketCode) {
    if (!market) return [...this.snapshots];
    return this.snapshots.filter((snapshot) => snapshot.market === market);
  }

  async getIndexSnapshot(symbol: string) {
    return this.snapshots.find((snapshot) => snapshot.symbol === symbol) ?? null;
  }

  async getIndexSeries(symbol: string, range: GlobalIndexRange) {
    const points = this.series[symbol] ?? [];
    const limitByRange: Record<GlobalIndexRange, number> = {
      "30d": 30,
      "90d": 90,
      "120d": 120
    };

    return [...points].slice(-limitByRange[range]);
  }
}

export type VendorGlobalIndexProvider = GlobalIndexProvider;
