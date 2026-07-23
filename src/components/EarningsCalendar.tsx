import React from 'react';
import { EarningsEvent, StockSymbol } from '../types';

interface EarningsCalendarProps {
  events: EarningsEvent[];
  allSymbols: StockSymbol[];
  onSelectSymbol: (symbol: StockSymbol) => void;
}

export const EarningsCalendar: React.FC<EarningsCalendarProps> = ({
  events,
  allSymbols,
  onSelectSymbol,
}) => {
  return (
    <section className="py-8 md:py-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-headline text-2xl md:text-3xl font-bold text-[#181c21]">
            Earnings Calendar
          </h2>
          <p className="text-xs text-[#737687] mt-1 font-body">
            Upcoming corporate financial reporting dates & EPS estimates
          </p>
        </div>
        <button
          onClick={() => {
            // Pick first earnings item or trigger modal
            if (events.length > 0) {
              const symbolItem = allSymbols.find((s) => s.symbol === events[0].symbol);
              if (symbolItem) onSelectSymbol(symbolItem);
            }
          }}
          className="text-[#0049db] font-mono-data text-xs md:text-sm font-medium hover:underline flex items-center gap-1"
        >
          See more events
          <span className="material-symbols-outlined text-sm">chevron_right</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {events.map((item) => {
          const matchingStock = allSymbols.find((s) => s.symbol === item.symbol);

          return (
            <div
              key={item.id}
              onClick={() => {
                if (matchingStock) {
                  onSelectSymbol(matchingStock);
                }
              }}
              className="p-4 border border-[#E0E3EB] rounded-xl market-card-hover cursor-pointer bg-[#FFFFFF] shadow-2xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono-data text-[10px] bg-[#ebeef5] px-2 py-0.5 rounded text-[#181c21] font-semibold">
                    {item.badge}
                  </span>
                  <span className="font-mono-data text-[10px] text-[#737687]">
                    {item.time}
                  </span>
                </div>

                <div className="font-headline text-lg font-bold text-[#181c21] mb-0.5">
                  {item.symbol}
                </div>
                <div className="font-body text-xs text-[#6A6D78] truncate mb-4">
                  {item.name}
                </div>
              </div>

              <div className="flex justify-between items-center text-xs border-t border-[#E0E3EB] pt-3">
                <span className="text-[#737687] font-mono-data">Estimate</span>
                <span className="font-mono-data font-bold text-[#181c21]">
                  {item.estimate}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
