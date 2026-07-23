export type MarketCategory = 'Indices' | 'Stocks' | 'Crypto' | 'Futures' | 'Forex' | 'Bonds';

export interface ChartPoint {
  time: string;
  price: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface StockSymbol {
  symbol: string;
  name: string;
  exchange: string;
  category: MarketCategory;
  price: number;
  change: number;
  changePercent: number;
  volume: string; // e.g., "128.5M"
  rawVolume: number;
  marketCap?: string;
  peRatio?: number;
  high52w?: number;
  low52w?: number;
  sparkline: number[]; // array of normalized points 0..100
  chartData?: ChartPoint[];
  starred?: boolean;
  sector?: string;
  analystRating?: 'Strong Buy' | 'Buy' | 'Hold' | 'Sell';
}

export interface CommunityTrendItem {
  id: string;
  symbol: string;
  name: string;
  exchange: string;
  initial: string;
  bgColor: string;
  textColor: string;
  trend: 'up' | 'down';
  changePercent: number;
}

export interface EarningsEvent {
  id: string;
  symbol: string;
  name: string;
  badge: 'Today' | 'Tomorrow' | 'This Week';
  time: 'After Hours' | 'Before Market';
  estimate: string;
  price: number;
}

export interface ScreenerFilter {
  category: MarketCategory;
  minPrice: number;
  maxPrice: number;
  minChange: number;
  searchQuery: string;
  sector: string;
}
