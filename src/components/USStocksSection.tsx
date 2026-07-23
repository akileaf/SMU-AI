import React, { useState } from 'react';
import { StockSymbol } from '../types';
import { TrendingUp, BarChart2, Activity } from 'lucide-react';

interface USStocksSectionProps {
  stocks: StockSymbol[];
  featuredStock: StockSymbol;
  onSelectFeatured: (stock: StockSymbol) => void;
  onOpenDetailModal: (stock: StockSymbol) => void;
  onSeeAll: () => void;
}

export const USStocksSection: React.FC<USStocksSectionProps> = ({
  stocks,
  featuredStock,
  onSelectFeatured,
  onOpenDetailModal,
  onSeeAll,
}) => {
  const [timeframe, setTimeframe] = useState<'1D' | '1W' | '1M' | '1Y' | 'ALL'>('1D');
  const [chartType, setChartType] = useState<'area' | 'candles'>('area');
  const [hoveredPointIndex, setHoveredPointIndex] = useState<number | null>(null);

  const sideStocks = stocks.filter((s) => s.symbol !== featuredStock.symbol).slice(0, 5);

  const isUp = featuredStock.change >= 0;
  const strokeColor = isUp ? '#089981' : '#F23645';

  const chartData = featuredStock.chartData || [];
  const minPrice = chartData.length > 0 ? Math.min(...chartData.map((d) => d.low || d.price)) : 100;
  const maxPrice = chartData.length > 0 ? Math.max(...chartData.map((d) => d.high || d.price)) : 150;
  const range = maxPrice - minPrice || 1;

  // Generate SVG path for interactive chart
  const pathPoints = chartData
    .map((point, idx) => {
      const x = (idx / (chartData.length - 1)) * 100;
      const y = 90 - ((point.price - minPrice) / range) * 80;
      return `${x},${y}`;
    })
    .join(' ');

  const areaPoints = `0,100 ${pathPoints} 100,100`;

  const hoveredPoint = hoveredPointIndex !== null ? chartData[hoveredPointIndex] : null;

  return (
    <section className="py-8 md:py-10 grid grid-cols-1 xl:grid-cols-12 gap-8">
      {/* US Stocks Left Main Featured Panel */}
      <div className="xl:col-span-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-headline text-2xl md:text-3xl font-bold text-[#181c21]">
            US stocks
          </h2>
          <button
            onClick={onSeeAll}
            className="text-[#0049db] font-mono-data text-xs md:text-sm font-medium flex items-center gap-1 hover:underline group"
          >
            See all US stocks
            <span className="material-symbols-outlined text-sm transition-transform group-hover:translate-x-0.5">
              chevron_right
            </span>
          </button>
        </div>

        {/* Featured Stock Container */}
        <div className="bg-[#FFFFFF] border border-[#E0E3EB] rounded-xl overflow-hidden shadow-2xs">
          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Featured Stock Left Column: Chart & Header */}
            <div className="p-6 border-b md:border-b-0 md:border-r border-[#E0E3EB] hover:bg-[#F8F9FB] transition-all group">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#ebeef5] text-[#181c21] flex items-center justify-center rounded-lg font-bold text-lg font-mono-data border border-[#E0E3EB]">
                    {featuredStock.symbol.charAt(0)}
                  </div>
                  <div>
                    <div
                      onClick={() => onOpenDetailModal(featuredStock)}
                      className="font-headline text-lg font-semibold text-[#181c21] group-hover:text-[#0049db] transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      {featuredStock.name}
                      <span className="material-symbols-outlined text-sm text-[#737687]">open_in_new</span>
                    </div>
                    <div className="font-mono-data text-[11px] text-[#737687]">
                      {featuredStock.exchange}: {featuredStock.symbol}
                    </div>
                  </div>
                </div>

                {/* Chart Type Toggle */}
                <div className="flex items-center gap-1 bg-[#f1f4fb] p-0.5 rounded border border-[#E0E3EB]">
                  <button
                    onClick={() => setChartType('area')}
                    className={`px-2 py-0.5 font-mono-data text-[10px] rounded ${
                      chartType === 'area' ? 'bg-[#FFFFFF] shadow-xs text-[#0049db] font-bold' : 'text-[#737687]'
                    }`}
                  >
                    Area
                  </button>
                  <button
                    onClick={() => setChartType('candles')}
                    className={`px-2 py-0.5 font-mono-data text-[10px] rounded ${
                      chartType === 'candles' ? 'bg-[#FFFFFF] shadow-xs text-[#0049db] font-bold' : 'text-[#737687]'
                    }`}
                  >
                    Candles
                  </button>
                </div>
              </div>

              {/* Dynamic Price Display */}
              <div className="flex items-center justify-between mb-4">
                <div className="font-mono-data text-2xl md:text-3xl font-bold text-[#181c21]">
                  ${(hoveredPoint ? hoveredPoint.price : featuredStock.price).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                  })}
                </div>
                <div className="text-right font-mono-data text-xs md:text-sm">
                  <div className={isUp ? 'text-[#089981] font-semibold' : 'text-[#F23645] font-semibold'}>
                    {isUp ? '+' : ''}
                    {featuredStock.change.toFixed(2)}
                  </div>
                  <div className={isUp ? 'text-[#089981] font-semibold' : 'text-[#F23645] font-semibold'}>
                    {isUp ? '+' : ''}
                    {featuredStock.changePercent.toFixed(2)}%
                  </div>
                </div>
              </div>

              {/* Timeframe Selector */}
              <div className="flex items-center gap-1 mb-3">
                {(['1D', '1W', '1M', '1Y', 'ALL'] as const).map((tf) => (
                  <button
                    key={tf}
                    onClick={() => setTimeframe(tf)}
                    className={`px-2 py-0.5 font-mono-data text-[11px] rounded transition-all ${
                      timeframe === tf
                        ? 'bg-[#0049db] text-white font-bold'
                        : 'text-[#737687] hover:bg-[#f1f4fb] hover:text-[#181c21]'
                    }`}
                  >
                    {tf}
                  </button>
                ))}
              </div>

              {/* Interactive SVG Chart Box */}
              <div
                className="h-44 w-full bg-[#f1f4fb]/60 rounded-lg relative overflow-hidden border border-[#E0E3EB] p-2"
                onMouseLeave={() => setHoveredPointIndex(null)}
              >
                {chartType === 'area' ? (
                  <svg
                    className="w-full h-full cursor-crosshair"
                    viewBox="0 0 100 100"
                    preserveAspectRatio="none"
                    onMouseMove={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      const xPercent = (e.clientX - rect.left) / rect.width;
                      const idx = Math.min(
                        chartData.length - 1,
                        Math.max(0, Math.floor(xPercent * chartData.length))
                      );
                      setHoveredPointIndex(idx);
                    }}
                  >
                    <defs>
                      <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={strokeColor} stopOpacity="0.25" />
                        <stop offset="100%" stopColor={strokeColor} stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    <polygon points={areaPoints} fill="url(#chartGrad)" />
                    <polyline
                      points={pathPoints}
                      fill="none"
                      stroke={strokeColor}
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />

                    {/* Cursor Crosshair indicator */}
                    {hoveredPointIndex !== null && (
                      <line
                        x1={(hoveredPointIndex / (chartData.length - 1)) * 100}
                        y1="0"
                        x2={(hoveredPointIndex / (chartData.length - 1)) * 100}
                        y2="100"
                        stroke="#0049db"
                        strokeWidth="1"
                        strokeDasharray="2,2"
                      />
                    )}
                  </svg>
                ) : (
                  <div className="w-full h-full flex items-end justify-between gap-1 px-1">
                    {chartData.slice(0, 18).map((pt, i) => {
                      const isGreen = pt.close >= pt.open;
                      const barHeight = Math.max(10, ((pt.high - pt.low) / range) * 80);
                      return (
                        <div
                          key={i}
                          className="flex-1 flex flex-col items-center justify-end h-full cursor-pointer"
                          onMouseEnter={() => setHoveredPointIndex(i)}
                        >
                          <div
                            className={`w-full rounded-xs transition-all ${
                              isGreen ? 'bg-[#089981]' : 'bg-[#F23645]'
                            }`}
                            style={{ height: `${barHeight}%` }}
                          />
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Floating Tooltip info on hover */}
                {hoveredPoint && (
                  <div className="absolute top-2 left-2 bg-[#181c21] text-white px-2 py-1 rounded text-[10px] font-mono-data shadow-md z-10 pointer-events-none">
                    <span>{hoveredPoint.time}</span> |{' '}
                    <span className="font-bold">${hoveredPoint.price.toFixed(2)}</span>
                  </div>
                )}

                <div className="absolute bottom-1 right-2 text-[10px] font-mono-data text-[#737687]">
                  Interactive Chart
                </div>
              </div>
            </div>

            {/* Side list of stocks */}
            <div className="flex flex-col divide-y divide-[#E0E3EB]">
              {sideStocks.map((s) => (
                <div
                  key={s.symbol}
                  onClick={() => onSelectFeatured(s)}
                  className={`flex items-center justify-between p-4 hover:bg-[#f1f4fb] cursor-pointer transition-colors ${
                    featuredStock.symbol === s.symbol ? 'bg-[#dfe2f2]/40 font-semibold' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono-data text-xs font-bold w-12 text-[#737687]">
                      {s.symbol}
                    </span>
                    <span className="font-body text-xs md:text-sm font-semibold text-[#181c21] truncate max-w-[120px] sm:max-w-[160px]">
                      {s.name}
                    </span>
                  </div>
                  <div className="text-right font-mono-data">
                    <div className="text-xs md:text-sm font-bold text-[#181c21]">
                      ${s.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </div>
                    <div
                      className={`text-[11px] font-semibold ${
                        s.change >= 0 ? 'text-[#089981]' : 'text-[#F23645]'
                      }`}
                    >
                      {s.change >= 0 ? '+' : ''}
                      {s.changePercent.toFixed(2)}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Community Trends Sidebar (XL Column 4) */}
      <div className="xl:col-span-4">
        {/* Rendered inside parent layout */}
      </div>
    </section>
  );
};
