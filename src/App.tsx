import React, { useState, useEffect } from 'react';
import { MarketCategory, StockSymbol } from './types';
import {
  INITIAL_INDICES,
  INITIAL_STOCKS,
  INITIAL_CRYPTO,
  INITIAL_FUTURES,
  INITIAL_FOREX,
  INITIAL_BONDS,
  COMMUNITY_TRENDS,
  EARNINGS_CALENDAR,
} from './data/marketData';

import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { HeroSubnav } from './components/HeroSubnav';
import { WorldIndices } from './components/WorldIndices';
import { USStocksSection } from './components/USStocksSection';
import { CommunityTrends } from './components/CommunityTrends';
import { HighestVolumeTable } from './components/HighestVolumeTable';
import { EarningsCalendar } from './components/EarningsCalendar';
import { StockDetailModal } from './components/StockDetailModal';
import { ScreenerModal } from './components/ScreenerModal';
import { WatchlistDrawer } from './components/WatchlistDrawer';
import { Footer } from './components/Footer';

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState<MarketCategory>('Stocks');

  // Datasets
  const [indices, setIndices] = useState<StockSymbol[]>(INITIAL_INDICES);
  const [stocks, setStocks] = useState<StockSymbol[]>(INITIAL_STOCKS);
  const [crypto, setCrypto] = useState<StockSymbol[]>(INITIAL_CRYPTO);
  const [futures, setFutures] = useState<StockSymbol[]>(INITIAL_FUTURES);
  const [forex, setForex] = useState<StockSymbol[]>(INITIAL_FOREX);
  const [bonds, setBonds] = useState<StockSymbol[]>(INITIAL_BONDS);

  // Featured Stock for US Stocks section (default NVDA)
  const [featuredStock, setFeaturedStock] = useState<StockSymbol>(
    INITIAL_STOCKS.find((s) => s.symbol === 'NVDA') || INITIAL_STOCKS[0]
  );

  // Modals & Drawers
  const [selectedModalSymbol, setSelectedModalSymbol] = useState<StockSymbol | null>(null);
  const [isWatchlistOpen, setIsWatchlistOpen] = useState(false);
  const [isScreenerOpen, setIsScreenerOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Real-time live simulation
  const [isLiveSimulation, setIsLiveSimulation] = useState(true);

  // Paper trading balance & portfolio
  const [userBalance, setUserBalance] = useState(100000);
  const [userHoldings, setUserHoldings] = useState<{ [symbol: string]: number }>({
    NVDA: 10,
    AAPL: 5,
  });

  // Combine all symbols for search & watchlist
  const allSymbols = [...indices, ...stocks, ...crypto, ...futures, ...forex, ...bonds];

  // Starred symbols count
  const starredSymbols = allSymbols.filter((s) => s.starred);

  // Live Price Ticker Simulation
  useEffect(() => {
    if (!isLiveSimulation) return;

    const interval = setInterval(() => {
      const updateList = (prev: StockSymbol[]) =>
        prev.map((item) => {
          // 40% chance of price tick for each symbol per interval
          if (Math.random() > 0.6) {
            const pctChange = (Math.random() - 0.49) * 0.008;
            const newPrice = Math.max(0.01, item.price * (1 + pctChange));
            const diff = newPrice - item.price;
            const newChange = item.change + diff;
            const newChangePercent = (newChange / (newPrice - newChange)) * 100;

            const updatedChart = item.chartData ? [...item.chartData] : [];
            if (updatedChart.length > 0) {
              const last = updatedChart[updatedChart.length - 1];
              updatedChart[updatedChart.length - 1] = {
                ...last,
                price: Number(newPrice.toFixed(2)),
                close: Number(newPrice.toFixed(2)),
                high: Math.max(last.high, newPrice),
                low: Math.min(last.low, newPrice),
              };
            }

            return {
              ...item,
              price: Number(newPrice.toFixed(2)),
              change: Number(newChange.toFixed(2)),
              changePercent: Number(newChangePercent.toFixed(2)),
              chartData: updatedChart,
            };
          }
          return item;
        });

      setIndices(updateList);
      setStocks(updateList);
      setCrypto(updateList);
      setFutures(updateList);
      setForex(updateList);
      setBonds(updateList);
    }, 2000);

    return () => clearInterval(interval);
  }, [isLiveSimulation]);

  // Keep featuredStock updated with live ticks
  useEffect(() => {
    const updated = stocks.find((s) => s.symbol === featuredStock.symbol);
    if (updated) {
      setFeaturedStock(updated);
    }
  }, [stocks]);

  // Keep selectedModalSymbol updated with live ticks
  useEffect(() => {
    if (selectedModalSymbol) {
      const updated = allSymbols.find((s) => s.symbol === selectedModalSymbol.symbol);
      if (updated) {
        setSelectedModalSymbol(updated);
      }
    }
  }, [indices, stocks, crypto, futures, forex, bonds]);

  // Toggle Star on symbol
  const handleToggleStar = (symbolStr: string, e: React.MouseEvent) => {
    e.stopPropagation();

    const toggleInList = (list: StockSymbol[]) =>
      list.map((item) =>
        item.symbol === symbolStr ? { ...item, starred: !item.starred } : item
      );

    setIndices(toggleInList);
    setStocks(toggleInList);
    setCrypto(toggleInList);
    setFutures(toggleInList);
    setForex(toggleInList);
    setBonds(toggleInList);
  };

  // Trade execution
  const handleExecuteTrade = (
    symbolStr: string,
    qty: number,
    type: 'buy' | 'sell',
    price: number
  ) => {
    const cost = qty * price;
    if (type === 'buy') {
      setUserBalance((prev) => prev - cost);
      setUserHoldings((prev) => ({
        ...prev,
        [symbolStr]: (prev[symbolStr] || 0) + qty,
      }));
    } else {
      setUserBalance((prev) => prev + cost);
      setUserHoldings((prev) => ({
        ...prev,
        [symbolStr]: Math.max(0, (prev[symbolStr] || 0) - qty),
      }));
    }
  };

  // Determine current active symbols based on selected category
  const activeCategorySymbols = () => {
    switch (selectedCategory) {
      case 'Indices':
        return indices;
      case 'Crypto':
        return crypto;
      case 'Futures':
        return futures;
      case 'Forex':
        return forex;
      case 'Bonds':
        return bonds;
      case 'Stocks':
      default:
        return stocks;
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFFFF] text-[#181c21] font-body flex flex-col antialiased">
      {/* Top Navigation Bar */}
      <Header
        allSymbols={allSymbols}
        onSelectSymbol={(sym) => setSelectedModalSymbol(sym)}
        starredCount={starredSymbols.length}
        onOpenWatchlist={() => setIsWatchlistOpen(true)}
        isLiveSimulation={isLiveSimulation}
        onToggleLiveSimulation={() => setIsLiveSimulation(!isLiveSimulation)}
        onToggleMobileSidebar={() => setIsMobileSidebarOpen(true)}
        onOpenScreener={() => setIsScreenerOpen(true)}
      />

      {/* Main Layout Container */}
      <div className="flex max-w-[1440px] mx-auto w-full flex-1">
        {/* Navigation Drawer (Sidebar) */}
        <Sidebar
          selectedCategory={selectedCategory}
          onSelectCategory={(cat) => setSelectedCategory(cat)}
          onOpenScreener={() => setIsScreenerOpen(true)}
          isMobileOpen={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
        />

        {/* Main Content View */}
        <main className="flex-1 min-w-0 bg-[#FFFFFF] px-4 md:px-8 pb-20">
          {/* Hero Heading & Category Pills */}
          <HeroSubnav
            selectedCategory={selectedCategory}
            onSelectCategory={(cat) => setSelectedCategory(cat)}
          />

          {/* Section 1: World Indices */}
          <WorldIndices
            indices={indices}
            onSelectSymbol={(sym) => setSelectedModalSymbol(sym)}
            onToggleStar={handleToggleStar}
            onSeeAll={() => {
              setSelectedCategory('Indices');
              window.scrollTo({ top: 300, behavior: 'smooth' });
            }}
          />

          {/* Section 2: US Stocks & Community Trends */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 py-4">
            <div className="xl:col-span-8">
              <USStocksSection
                stocks={stocks}
                featuredStock={featuredStock}
                onSelectFeatured={(sym) => setFeaturedStock(sym)}
                onOpenDetailModal={(sym) => setSelectedModalSymbol(sym)}
                onSeeAll={() => {
                  setSelectedCategory('Stocks');
                  window.scrollTo({ top: 300, behavior: 'smooth' });
                }}
              />
            </div>

            <div className="xl:col-span-4 pt-4 xl:pt-14">
              <CommunityTrends
                trends={COMMUNITY_TRENDS}
                allSymbols={allSymbols}
                onSelectSymbol={(sym) => setSelectedModalSymbol(sym)}
              />
            </div>
          </div>

          {/* Section 3: Highest Volume Table */}
          <HighestVolumeTable
            stocks={activeCategorySymbols()}
            onSelectSymbol={(sym) => setSelectedModalSymbol(sym)}
            onSeeAll={() => setIsScreenerOpen(true)}
          />

          {/* Section 4: Earnings Calendar */}
          <EarningsCalendar
            events={EARNINGS_CALENDAR}
            allSymbols={allSymbols}
            onSelectSymbol={(sym) => setSelectedModalSymbol(sym)}
          />
        </main>
      </div>

      {/* Footer */}
      <Footer onOpenScreener={() => setIsScreenerOpen(true)} />

      {/* Stock Detail & Interactive Chart Modal */}
      <StockDetailModal
        symbol={selectedModalSymbol}
        onClose={() => setSelectedModalSymbol(null)}
        onToggleStar={handleToggleStar}
        userBalance={userBalance}
        onExecuteTrade={handleExecuteTrade}
        userHoldingsQty={
          selectedModalSymbol ? userHoldings[selectedModalSymbol.symbol] || 0 : 0
        }
      />

      {/* Stock Screener Modal */}
      {isScreenerOpen && (
        <ScreenerModal
          allSymbols={allSymbols}
          onClose={() => setIsScreenerOpen(false)}
          onSelectSymbol={(sym) => setSelectedModalSymbol(sym)}
        />
      )}

      {/* Watchlist Drawer */}
      <WatchlistDrawer
        isOpen={isWatchlistOpen}
        onClose={() => setIsWatchlistOpen(false)}
        starredSymbols={starredSymbols}
        onSelectSymbol={(sym) => setSelectedModalSymbol(sym)}
        onToggleStar={handleToggleStar}
      />
    </div>
  );
}
