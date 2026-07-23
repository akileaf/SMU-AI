import React, { useState } from 'react';
import { StockSymbol } from '../types';
import { X, Star, ArrowUpRight, TrendingUp, DollarSign, PieChart, ShieldAlert } from 'lucide-react';

interface StockDetailModalProps {
  symbol: StockSymbol | null;
  onClose: () => void;
  onToggleStar: (symbol: string, e: React.MouseEvent) => void;
  userBalance: number;
  onExecuteTrade: (symbol: string, qty: number, type: 'buy' | 'sell', price: number) => void;
  userHoldingsQty: number;
}

export const StockDetailModal: React.FC<StockDetailModalProps> = ({
  symbol,
  onClose,
  onToggleStar,
  userBalance,
  onExecuteTrade,
  userHoldingsQty,
}) => {
  if (!symbol) return null;

  const [timeframe, setTimeframe] = useState<'1D' | '1W' | '1M' | '1Y' | 'ALL'>('1M');
  const [tradeTab, setTradeTab] = useState<'buy' | 'sell'>('buy');
  const [tradeShares, setTradeShares] = useState<number>(1);
  const [tradeNotice, setTradeNotice] = useState<string | null>(null);

  const isUp = symbol.change >= 0;
  const strokeColor = isUp ? '#089981' : '#F23645';

  const chartData = symbol.chartData || [];
  const minPrice = chartData.length > 0 ? Math.min(...chartData.map((d) => d.low || d.price)) : symbol.price * 0.9;
  const maxPrice = chartData.length > 0 ? Math.max(...chartData.map((d) => d.high || d.price)) : symbol.price * 1.1;
  const range = maxPrice - minPrice || 1;

  const pathPoints = chartData
    .map((point, idx) => {
      const x = (idx / (chartData.length - 1)) * 100;
      const y = 90 - ((point.price - minPrice) / range) * 80;
      return `${x},${y}`;
    })
    .join(' ');

  const areaPoints = `0,100 ${pathPoints} 100,100`;

  const totalCost = tradeShares * symbol.price;

  const handleOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (tradeShares <= 0) return;

    if (tradeTab === 'buy') {
      if (totalCost > userBalance) {
        setTradeNotice('Insufficient USD paper balance.');
        return;
      }
      onExecuteTrade(symbol.symbol, tradeShares, 'buy', symbol.price);
      setTradeNotice(`Order Executed! Bought ${tradeShares} share(s) of ${symbol.symbol}.`);
    } else {
      if (tradeShares > userHoldingsQty) {
        setTradeNotice(`Cannot sell ${tradeShares}. You only own ${userHoldingsQty} share(s).`);
        return;
      }
      onExecuteTrade(symbol.symbol, tradeShares, 'sell', symbol.price);
      setTradeNotice(`Order Executed! Sold ${tradeShares} share(s) of ${symbol.symbol}.`);
    }

    setTimeout(() => setTradeNotice(null), 3500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative bg-[#FFFFFF] rounded-2xl border border-[#E0E3EB] w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl z-10 p-6 flex flex-col gap-6 my-auto custom-scrollbar">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-[#E0E3EB] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-[#2962ff] text-white flex items-center justify-center rounded-xl font-bold text-xl font-mono-data shadow-xs">
              {symbol.symbol.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-headline text-2xl font-bold text-[#181c21]">
                  {symbol.name}
                </h2>
                <span className="font-mono-data text-xs bg-[#f1f4fb] px-2 py-0.5 rounded text-[#0049db] font-semibold border border-[#E0E3EB]">
                  {symbol.exchange}: {symbol.symbol}
                </span>
              </div>
              <p className="font-mono-data text-xs text-[#737687] mt-0.5">
                Category: {symbol.category} | Sector: {symbol.sector || 'General Market'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={(e) => onToggleStar(symbol.symbol, e)}
              className="p-2 text-[#737687] hover:text-amber-500 rounded-lg hover:bg-[#f1f4fb] transition-colors"
              title="Bookmark symbol"
            >
              <span
                className={`material-symbols-outlined text-2xl ${
                  symbol.starred ? 'filled text-amber-500' : ''
                }`}
              >
                star
              </span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-[#737687] hover:text-[#181c21] rounded-lg hover:bg-[#f1f4fb] transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Main Grid: Price + Chart + Order Form */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left 2 Cols: Chart & Key Stats */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {/* Price Banner */}
            <div className="flex items-baseline justify-between bg-[#F8F9FB] p-4 rounded-xl border border-[#E0E3EB]">
              <div>
                <span className="text-xs text-[#737687] font-mono-data uppercase block mb-1">Current Price</span>
                <div className="font-mono-data text-3xl font-bold text-[#181c21]">
                  ${symbol.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </div>
              </div>
              <div className="text-right">
                <div
                  className={`font-mono-data text-base font-bold flex items-center justify-end ${
                    isUp ? 'text-[#089981]' : 'text-[#F23645]'
                  }`}
                >
                  <span className="material-symbols-outlined text-lg mr-0.5">
                    {isUp ? 'arrow_drop_up' : 'arrow_drop_down'}
                  </span>
                  {isUp ? '+' : ''}
                  {symbol.change.toFixed(2)} ({isUp ? '+' : ''}
                  {symbol.changePercent.toFixed(2)}%)
                </div>
                <span className="text-[11px] text-[#737687] font-mono-data">Volume: {symbol.volume}</span>
              </div>
            </div>

            {/* Timeframe & SVG Chart */}
            <div className="border border-[#E0E3EB] rounded-xl p-4 bg-[#FFFFFF]">
              <div className="flex items-center justify-between mb-4">
                <span className="font-mono-data text-xs font-semibold text-[#181c21]">Price Chart</span>
                <div className="flex items-center gap-1 bg-[#f1f4fb] p-1 rounded-lg border border-[#E0E3EB]">
                  {(['1D', '1W', '1M', '1Y', 'ALL'] as const).map((tf) => (
                    <button
                      key={tf}
                      onClick={() => setTimeframe(tf)}
                      className={`px-2.5 py-1 font-mono-data text-xs rounded transition-all ${
                        timeframe === tf
                          ? 'bg-[#0049db] text-white font-bold shadow-xs'
                          : 'text-[#737687] hover:text-[#181c21]'
                      }`}
                    >
                      {tf}
                    </button>
                  ))}
                </div>
              </div>

              <div className="h-56 w-full bg-[#f1f4fb]/50 rounded-lg p-2 border border-[#E0E3EB] relative">
                <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="modalChartGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={strokeColor} stopOpacity="0.3" />
                      <stop offset="100%" stopColor={strokeColor} stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  <polygon points={areaPoints} fill="url(#modalChartGrad)" />
                  <polyline
                    points={pathPoints}
                    fill="none"
                    stroke={strokeColor}
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>

            {/* Key Statistics Grid */}
            <div>
              <h3 className="font-headline text-lg font-bold text-[#181c21] mb-3">Key Statistics</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="p-3 bg-[#F8F9FB] border border-[#E0E3EB] rounded-lg">
                  <p className="text-[11px] font-mono-data text-[#737687]">Market Cap</p>
                  <p className="font-mono-data text-sm font-bold text-[#181c21] mt-0.5">
                    {symbol.marketCap || 'N/A'}
                  </p>
                </div>
                <div className="p-3 bg-[#F8F9FB] border border-[#E0E3EB] rounded-lg">
                  <p className="text-[11px] font-mono-data text-[#737687]">P/E Ratio</p>
                  <p className="font-mono-data text-sm font-bold text-[#181c21] mt-0.5">
                    {symbol.peRatio ? symbol.peRatio.toFixed(1) : 'N/A'}
                  </p>
                </div>
                <div className="p-3 bg-[#F8F9FB] border border-[#E0E3EB] rounded-lg">
                  <p className="text-[11px] font-mono-data text-[#737687]">Analyst Rating</p>
                  <p className="font-mono-data text-sm font-bold text-[#089981] mt-0.5">
                    {symbol.analystRating || 'Buy'}
                  </p>
                </div>
                <div className="p-3 bg-[#F8F9FB] border border-[#E0E3EB] rounded-lg">
                  <p className="text-[11px] font-mono-data text-[#737687]">52W High</p>
                  <p className="font-mono-data text-sm font-bold text-[#181c21] mt-0.5">
                    ${symbol.high52w ? symbol.high52w.toFixed(2) : (symbol.price * 1.15).toFixed(2)}
                  </p>
                </div>
                <div className="p-3 bg-[#F8F9FB] border border-[#E0E3EB] rounded-lg">
                  <p className="text-[11px] font-mono-data text-[#737687]">52W Low</p>
                  <p className="font-mono-data text-sm font-bold text-[#181c21] mt-0.5">
                    ${symbol.low52w ? symbol.low52w.toFixed(2) : (symbol.price * 0.85).toFixed(2)}
                  </p>
                </div>
                <div className="p-3 bg-[#F8F9FB] border border-[#E0E3EB] rounded-lg">
                  <p className="text-[11px] font-mono-data text-[#737687]">Day Volume</p>
                  <p className="font-mono-data text-sm font-bold text-[#181c21] mt-0.5">{symbol.volume}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Col: Paper Trading Form */}
          <div className="bg-[#F8F9FB] border border-[#E0E3EB] rounded-xl p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-[#E0E3EB] mb-4">
                <span className="font-headline font-bold text-lg text-[#181c21]">Paper Trading</span>
                <span className="font-mono-data text-xs text-[#089981] font-semibold bg-[#089981]/10 px-2 py-0.5 rounded">
                  Simulated
                </span>
              </div>

              {/* Account Balance Summary */}
              <div className="bg-[#FFFFFF] border border-[#E0E3EB] p-3 rounded-lg mb-4 text-xs font-mono-data">
                <div className="flex justify-between text-[#737687]">
                  <span>USD Balance:</span>
                  <span className="font-bold text-[#181c21]">${userBalance.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-[#737687] mt-1">
                  <span>Your Holdings:</span>
                  <span className="font-bold text-[#0049db]">{userHoldingsQty} shares</span>
                </div>
              </div>

              {/* Buy / Sell Tabs */}
              <div className="grid grid-cols-2 gap-1 p-1 bg-[#ebeef5] rounded-lg mb-4">
                <button
                  type="button"
                  onClick={() => setTradeTab('buy')}
                  className={`py-1.5 font-mono-data text-xs font-bold rounded transition-all ${
                    tradeTab === 'buy' ? 'bg-[#089981] text-white shadow-xs' : 'text-[#737687]'
                  }`}
                >
                  Buy {symbol.symbol}
                </button>
                <button
                  type="button"
                  onClick={() => setTradeTab('sell')}
                  className={`py-1.5 font-mono-data text-xs font-bold rounded transition-all ${
                    tradeTab === 'sell' ? 'bg-[#F23645] text-white shadow-xs' : 'text-[#737687]'
                  }`}
                >
                  Sell {symbol.symbol}
                </button>
              </div>

              <form onSubmit={handleOrder} className="space-y-4">
                <div>
                  <label className="block font-mono-data text-xs font-medium text-[#434656] mb-1">
                    Number of Shares
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10000"
                    value={tradeShares}
                    onChange={(e) => setTradeShares(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full px-3 py-2 bg-[#FFFFFF] border border-[#E0E3EB] rounded-lg font-mono-data text-sm text-[#181c21] focus:outline-none focus:border-[#0049db]"
                  />
                </div>

                <div className="p-3 bg-[#FFFFFF] border border-[#E0E3EB] rounded-lg space-y-1 font-mono-data text-xs">
                  <div className="flex justify-between text-[#737687]">
                    <span>Market Price:</span>
                    <span>${symbol.price.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-[#181c21] pt-1 border-t border-[#E0E3EB]">
                    <span>Total Cost:</span>
                    <span>${totalCost.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                  </div>
                </div>

                {tradeNotice && (
                  <div className="p-2.5 bg-[#2962ff]/10 text-[#0049db] border border-[#2962ff]/30 text-xs font-mono-data rounded-lg">
                    {tradeNotice}
                  </div>
                )}

                <button
                  type="submit"
                  className={`w-full py-2.5 rounded-lg font-mono-data text-xs font-bold text-white transition-all shadow-sm ${
                    tradeTab === 'buy'
                      ? 'bg-[#089981] hover:bg-[#00806b]'
                      : 'bg-[#F23645] hover:bg-[#ba1a1a]'
                  }`}
                >
                  Confirm {tradeTab === 'buy' ? 'Buy' : 'Sell'} Order
                </button>
              </form>
            </div>

            <div className="mt-6 pt-4 border-t border-[#E0E3EB] text-[11px] font-mono-data text-[#737687]">
              Disclaimer: Market overview and simulated order execution are provided for educational & analytical purposes.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
