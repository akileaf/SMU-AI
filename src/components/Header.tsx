import React, { useState } from 'react';
import { Search, Star, Activity, Menu, X, ArrowUpRight, TrendingUp } from 'lucide-react';
import { StockSymbol } from '../types';

interface HeaderProps {
  allSymbols: StockSymbol[];
  onSelectSymbol: (symbol: StockSymbol) => void;
  starredCount: number;
  onOpenWatchlist: () => void;
  isLiveSimulation: boolean;
  onToggleLiveSimulation: () => void;
  onToggleMobileSidebar: () => void;
  onOpenScreener: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  allSymbols,
  onSelectSymbol,
  starredCount,
  onOpenWatchlist,
  isLiveSimulation,
  onToggleLiveSimulation,
  onToggleMobileSidebar,
  onOpenScreener,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const filteredSymbols = searchQuery.trim()
    ? allSymbols.filter(
        (s) =>
          s.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.name.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 6)
    : [];

  return (
    <header className="sticky top-0 w-full flex justify-between items-center h-16 px-4 md:px-6 bg-[#FFFFFF] border-b border-[#E0E3EB] z-50">
      {/* Left side: Logo & Navigation */}
      <div className="flex items-center gap-4 lg:gap-6">
        <button
          onClick={onToggleMobileSidebar}
          className="lg:hidden p-1.5 text-[#434656] hover:text-[#0049db] rounded-md transition-colors"
          title="Toggle Navigation Menu"
        >
          <span className="material-symbols-outlined text-2xl">menu</span>
        </button>

        <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <span className="material-symbols-outlined text-[#0049db] text-2xl font-bold">trending_up</span>
          <span className="font-headline text-xl md:text-2xl font-black tracking-tight text-[#181c21]">
            TradingView
          </span>
        </div>

        <nav className="hidden lg:flex items-center gap-6">
          <button
            onClick={onOpenScreener}
            className="font-mono-data text-[13px] font-medium text-[#434656] hover:text-[#0049db] transition-colors flex items-center gap-1"
          >
            Products
          </button>
          <a
            href="#community"
            className="font-mono-data text-[13px] font-medium text-[#434656] hover:text-[#0049db] transition-colors"
          >
            Community
          </a>
          <a
            href="#markets"
            className="font-mono-data text-[13px] font-semibold text-[#0049db] border-b-2 border-[#0049db] pb-0.5"
          >
            Markets
          </a>
          <a
            href="#brokers"
            className="font-mono-data text-[13px] font-medium text-[#434656] hover:text-[#0049db] transition-colors"
          >
            Brokers
          </a>
          <button
            onClick={onOpenScreener}
            className="font-mono-data text-[13px] font-medium text-[#434656] hover:text-[#0049db] transition-colors"
          >
            Screener
          </button>
        </nav>
      </div>

      {/* Right side: Search, Live toggle, Watchlist, CTA */}
      <div className="flex items-center gap-3 md:gap-4">
        {/* Search bar with dropdown */}
        <div className="relative">
          <div className="relative flex items-center">
            <span className="material-symbols-outlined absolute left-3 text-[#737687] text-lg pointer-events-none">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
              placeholder="Search markets, symbols..."
              className="pl-9 pr-8 py-1.5 bg-[#f1f4fb] border border-[#E0E3EB] rounded text-xs md:text-sm text-[#181c21] w-36 sm:w-52 md:w-64 focus:w-64 md:focus:w-80 focus:outline-none focus:border-[#0049db] transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 text-[#737687] hover:text-[#181c21]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Predictive Search Modal Dropdown */}
          {isSearchFocused && filteredSymbols.length > 0 && (
            <div className="absolute left-0 right-0 top-full mt-1.5 bg-[#FFFFFF] border border-[#E0E3EB] rounded-lg shadow-xl z-50 overflow-hidden divide-y divide-[#E0E3EB]">
              <div className="px-3 py-1.5 bg-[#F8F9FB] font-mono-data text-[11px] text-[#737687] uppercase">
                Matching Symbols
              </div>
              {filteredSymbols.map((item) => (
                <div
                  key={item.symbol}
                  onMouseDown={() => {
                    onSelectSymbol(item);
                    setSearchQuery('');
                  }}
                  className="p-3 hover:bg-[#f1f4fb] cursor-pointer flex items-center justify-between transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono-data font-bold text-xs text-[#0049db] w-14">
                      {item.symbol}
                    </span>
                    <div>
                      <p className="text-xs font-semibold text-[#181c21] truncate max-w-[140px] sm:max-w-[180px]">
                        {item.name}
                      </p>
                      <p className="text-[10px] text-[#737687]">{item.exchange}</p>
                    </div>
                  </div>
                  <div className="text-right font-mono-data text-xs">
                    <div>${item.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
                    <div className={item.change >= 0 ? 'text-[#089981]' : 'text-[#F23645]'}>
                      {item.change >= 0 ? '+' : ''}
                      {item.changePercent.toFixed(2)}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Live Market Simulation Toggle */}
        <button
          onClick={onToggleLiveSimulation}
          className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded border text-xs font-mono-data transition-all ${
            isLiveSimulation
              ? 'bg-[#089981]/10 border-[#089981] text-[#089981] font-semibold'
              : 'bg-[#F8F9FB] border-[#E0E3EB] text-[#737687] hover:text-[#181c21]'
          }`}
          title="Toggle live price ticks"
        >
          <span
            className={`w-2 h-2 rounded-full ${
              isLiveSimulation ? 'bg-[#089981] animate-ping' : 'bg-[#737687]'
            }`}
          />
          {isLiveSimulation ? 'Live Data ON' : 'Paused'}
        </button>

        {/* Watchlist button */}
        <button
          onClick={onOpenWatchlist}
          className="relative p-2 bg-[#f1f4fb] hover:bg-[#ebeef5] border border-[#E0E3EB] rounded text-[#181c21] transition-all flex items-center gap-1.5"
          title="Open Starred Watchlist"
        >
          <span className="material-symbols-outlined text-amber-500 text-lg">star</span>
          <span className="hidden md:inline font-mono-data text-xs font-medium">Watchlist</span>
          {starredCount > 0 && (
            <span className="bg-[#0049db] text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full font-mono-data">
              {starredCount}
            </span>
          )}
        </button>

        {/* Get started button */}
        <button
          onClick={onOpenScreener}
          className="bg-[#0049db] text-white px-3.5 py-1.5 rounded font-mono-data text-xs font-semibold hover:bg-[#2962ff] transition-all active:scale-95 shadow-sm"
        >
          Get started
        </button>
      </div>
    </header>
  );
};
