import React, { useState } from 'react';
import { StockSymbol, MarketCategory } from '../types';
import { X, Filter, RefreshCw, Check } from 'lucide-react';

interface ScreenerModalProps {
  allSymbols: StockSymbol[];
  onClose: () => void;
  onSelectSymbol: (symbol: StockSymbol) => void;
}

export const ScreenerModal: React.FC<ScreenerModalProps> = ({
  allSymbols,
  onClose,
  onSelectSymbol,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<MarketCategory | 'All'>('All');
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(100000);
  const [onlyPositive, setOnlyPositive] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filtered = allSymbols.filter((item) => {
    if (selectedCategory !== 'All' && item.category !== selectedCategory) return false;
    if (item.price < minPrice || item.price > maxPrice) return false;
    if (onlyPositive && item.changePercent <= 0) return false;
    if (
      searchQuery.trim() &&
      !item.symbol.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !item.name.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-xs" onClick={onClose} />

      <div className="relative bg-[#FFFFFF] rounded-2xl border border-[#E0E3EB] w-full max-w-4xl max-h-[88vh] overflow-hidden shadow-2xl z-10 flex flex-col my-auto">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-[#E0E3EB] flex items-center justify-between bg-[#F8F9FB]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#0049db] text-2xl">filter_alt</span>
            <div>
              <h2 className="font-headline text-xl font-bold text-[#181c21]">
                Stock & Market Screener
              </h2>
              <p className="text-xs text-[#737687] font-body">
                Filter across global markets by price, performance, and sector
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#737687] hover:text-[#181c21] rounded-lg hover:bg-[#E0E3EB] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Toolbar */}
        <div className="p-4 bg-[#FFFFFF] border-b border-[#E0E3EB] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Category */}
          <div>
            <label className="block text-[11px] font-mono-data text-[#737687] mb-1">
              Market Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as any)}
              className="w-full px-2.5 py-1.5 bg-[#f1f4fb] border border-[#E0E3EB] rounded text-xs font-mono-data text-[#181c21] focus:outline-none focus:border-[#0049db]"
            >
              <option value="All">All Categories</option>
              <option value="Stocks">Stocks</option>
              <option value="Indices">Indices</option>
              <option value="Crypto">Crypto</option>
              <option value="Futures">Futures</option>
              <option value="Forex">Forex</option>
              <option value="Bonds">Bonds</option>
            </select>
          </div>

          {/* Search Query */}
          <div>
            <label className="block text-[11px] font-mono-data text-[#737687] mb-1">
              Search Ticker / Name
            </label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="e.g. NVDA, Apple..."
              className="w-full px-2.5 py-1.5 bg-[#f1f4fb] border border-[#E0E3EB] rounded text-xs font-mono-data text-[#181c21] focus:outline-none focus:border-[#0049db]"
            />
          </div>

          {/* Max Price */}
          <div>
            <label className="block text-[11px] font-mono-data text-[#737687] mb-1">
              Max Price ($)
            </label>
            <input
              type="number"
              value={maxPrice === 100000 ? '' : maxPrice}
              onChange={(e) => setMaxPrice(e.target.value ? Number(e.target.value) : 100000)}
              placeholder="Any Max Price"
              className="w-full px-2.5 py-1.5 bg-[#f1f4fb] border border-[#E0E3EB] rounded text-xs font-mono-data text-[#181c21] focus:outline-none focus:border-[#0049db]"
            />
          </div>

          {/* Gains only toggle */}
          <div className="flex items-end pb-1">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-mono-data text-[#181c21]">
              <input
                type="checkbox"
                checked={onlyPositive}
                onChange={(e) => setOnlyPositive(e.target.checked)}
                className="rounded text-[#0049db] focus:ring-[#0049db]"
              />
              <span>Gainers Only (+%)</span>
            </label>
          </div>
        </div>

        {/* Screener Results Table */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-4">
          <div className="text-xs font-mono-data text-[#737687] mb-3 flex items-center justify-between">
            <span>Showing {filtered.length} matches</span>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setMinPrice(0);
                setMaxPrice(100000);
                setOnlyPositive(false);
                setSearchQuery('');
              }}
              className="text-[#0049db] hover:underline"
            >
              Reset Filters
            </button>
          </div>

          <table className="w-full text-left border-collapse">
            <thead className="bg-[#F8F9FB] border-b border-[#E0E3EB]">
              <tr>
                <th className="px-4 py-2.5 font-mono-data text-xs text-[#737687]">Symbol</th>
                <th className="px-4 py-2.5 font-mono-data text-xs text-[#737687]">Category</th>
                <th className="px-4 py-2.5 font-mono-data text-xs text-[#737687]">Price</th>
                <th className="px-4 py-2.5 font-mono-data text-xs text-[#737687]">Change %</th>
                <th className="px-4 py-2.5 font-mono-data text-xs text-[#737687] text-right">Volume</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E0E3EB]">
              {filtered.map((item) => {
                const isUp = item.change >= 0;
                return (
                  <tr
                    key={item.symbol}
                    onClick={() => {
                      onSelectSymbol(item);
                      onClose();
                    }}
                    className="hover:bg-[#f1f4fb] transition-colors cursor-pointer"
                  >
                    <td className="px-4 py-3">
                      <span className="font-mono-data font-bold text-xs text-[#0049db] mr-2">
                        {item.symbol}
                      </span>
                      <span className="font-body text-xs text-[#6A6D78]">{item.name}</span>
                    </td>
                    <td className="px-4 py-3 font-mono-data text-xs text-[#737687]">
                      {item.category}
                    </td>
                    <td className="px-4 py-3 font-mono-data text-xs font-bold text-[#181c21]">
                      ${item.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                    <td
                      className={`px-4 py-3 font-mono-data text-xs font-semibold ${
                        isUp ? 'text-[#089981]' : 'text-[#F23645]'
                      }`}
                    >
                      {isUp ? '+' : ''}
                      {item.changePercent.toFixed(2)}%
                    </td>
                    <td className="px-4 py-3 font-mono-data text-xs text-[#181c21] text-right">
                      {item.volume}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
