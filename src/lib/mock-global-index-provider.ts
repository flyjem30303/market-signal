import { MockGlobalIndexProvider } from "./global-index-provider";
import { mockGlobalIndexSeries, mockGlobalIndexSnapshots } from "./mock-global-index-fixture";

export const mockGlobalIndexProvider = new MockGlobalIndexProvider(
  mockGlobalIndexSnapshots,
  mockGlobalIndexSeries
);

