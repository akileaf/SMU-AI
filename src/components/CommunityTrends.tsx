import React from 'react';
import { CommunityTrendItem, StockSymbol } from '../types';

interface CommunityTrendsProps {
  trends: CommunityTrendItem[];
  allSymbols: StockSymbol[];
  onSelectSymbol: (symbol: StockSymbol) => void;
}

export const CommunityTrends: React.FC<CommunityTrendsProps> = ({
  trends,
  allSymbols,
  onSelectSymbol,
}) => {
  return (
    <div>
      <h2 className="font-headline text-2xl font-bold text-[#181c21] mb-6">
        Community trends
      </h2>
      <div className="space-y-3">
        {trends.map((item) => {
          const matchingStock = allSymbols.find((s) => s.symbol === item.symbol || s.symbol.startsWith(item.symbol));
          const isUp = item.trend === 'up';

          return (
            <div
              key={item.id}
              onClick={() => {
                if (matchingStock) {
                  onSelectSymbol(matchingStock);
                }
              }}
              className="flex items-center gap-4 p-3 rounded-lg border border-transparent hover:border-[#E0E3EB] hover:bg-[#f1f4fb] transition-all cursor-pointer group bg-[#FFFFFF] shadow-2xs"
            >
              {/* Badge Avatar */}
              <div
                className={`w-10 h-10 ${item.bgColor} ${item.textColor} rounded flex items-center justify-center font-bold text-lg font-mono-data`}
              >
                {item.initial}
              </div>

              {/* Symbol Details */}
              <div className="flex-1 min-w-0">
                <div className="font-body text-sm font-semibold text-[#181c21] truncate group-hover:text-[#0049db] transition-colors">
                  {item.name}
                </div>
                <div className="font-mono-data text-[11px] text-[#737687]">
                  {item.exchange}
                </div>
              </div>

              {/* Trend Icon */}
              <span
                className={`material-symbols-outlined text-xl ${
                  isUp ? 'text-[#089981]' : 'text-[#F23645]'
                }`}
              >
                {isUp ? 'trending_up' : 'trending_down'}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
