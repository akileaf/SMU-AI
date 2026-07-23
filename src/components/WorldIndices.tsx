import React from 'react';
import { StockSymbol } from '../types';

interface WorldIndicesProps {
  indices: StockSymbol[];
  onSelectSymbol: (symbol: StockSymbol) => void;
  onToggleStar: (symbol: string, e: React.MouseEvent) => void;
  onSeeAll: () => void;
}

export const WorldIndices: React.FC<WorldIndicesProps> = ({
  indices,
  onSelectSymbol,
  onToggleStar,
  onSeeAll,
}) => {
  return (
    <section className="py-8 md:py-10">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-headline text-2xl md:text-3xl font-bold text-[#181c21]">
          World indices
        </h2>
        <button
          onClick={onSeeAll}
          className="text-[#0049db] font-mono-data text-xs md:text-sm font-medium flex items-center gap-1 hover:underline group"
        >
          See all major indices
          <span className="material-symbols-outlined text-sm transition-transform group-hover:translate-x-0.5">
            chevron_right
          </span>
        </button>
      </div>

      {/* Grid for Indices Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {indices.map((item) => {
          const isUp = item.change >= 0;
          const strokeColor = isUp ? '#089981' : '#F23645';
          const fillColor = isUp ? 'rgba(8, 153, 129, 0.12)' : 'rgba(242, 54, 69, 0.12)';

          // Build dynamic SVG polygon points from sparkline
          const minVal = Math.min(...item.sparkline);
          const maxVal = Math.max(...item.sparkline);
          const range = maxVal - minVal || 1;
          const points = item.sparkline
            .map((val, idx) => {
              const x = (idx / (item.sparkline.length - 1)) * 100;
              const y = 35 - ((val - minVal) / range) * 28;
              return `${x},${y}`;
            })
            .join(' ');

          const polygonPoints = `0,40 ${points} 100,40`;

          return (
            <div
              key={item.symbol}
              onClick={() => onSelectSymbol(item)}
              className="border border-[#E0E3EB] rounded-xl p-4 flex flex-col justify-between market-card-hover cursor-pointer bg-[#FFFFFF] shadow-2xs hover:border-[#0049db]/40"
            >
              {/* Card Header */}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="font-mono-data text-[11px] font-medium text-[#737687] block uppercase">
                    {item.symbol}
                  </span>
                  <span className="font-headline text-lg font-semibold text-[#181c21]">
                    {item.name}
                  </span>
                </div>
                <button
                  onClick={(e) => onToggleStar(item.symbol, e)}
                  className="p-1 text-[#737687] hover:text-amber-500 transition-colors"
                  title="Bookmark Index"
                >
                  <span
                    className={`material-symbols-outlined text-lg ${
                      item.starred ? 'filled text-amber-500' : ''
                    }`}
                  >
                    star
                  </span>
                </button>
              </div>

              {/* Price & Sparkline */}
              <div className="flex items-end justify-between">
                <div>
                  <div className="font-mono-data text-lg md:text-xl font-bold text-[#181c21]">
                    {item.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </div>
                  <div
                    className={`font-mono-data text-xs font-semibold flex items-center ${
                      isUp ? 'text-[#089981]' : 'text-[#F23645]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-sm mr-0.5">
                      {isUp ? 'arrow_drop_up' : 'arrow_drop_down'}
                    </span>
                    {isUp ? '+' : ''}
                    {item.change.toFixed(2)} ({isUp ? '+' : ''}
                    {item.changePercent.toFixed(2)}%)
                  </div>
                </div>

                {/* SVG Sparkline */}
                <div className="w-24 h-10 relative overflow-hidden">
                  <svg className="w-full h-full" viewBox="0 0 100 40" preserveAspectRatio="none">
                    <polygon points={polygonPoints} fill={fillColor} />
                    <polyline
                      points={points}
                      fill="none"
                      stroke={strokeColor}
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
