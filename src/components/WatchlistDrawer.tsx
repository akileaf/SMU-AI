import React from 'react';
import { StockSymbol } from '../types';
import { X, Trash2, ExternalLink, Star } from 'lucide-react';

interface WatchlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  starredSymbols: StockSymbol[];
  onSelectSymbol: (symbol: StockSymbol) => void;
  onToggleStar: (symbol: string, e: React.MouseEvent) => void;
}

export const WatchlistDrawer: React.FC<WatchlistDrawerProps> = ({
  isOpen,
  onClose,
  starredSymbols,
  onSelectSymbol,
  onToggleStar,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="fixed inset-0 bg-black/40 backdrop-blur-xs" onClick={onClose} />

      <div className="fixed top-0 bottom-0 right-0 w-80 sm:w-96 bg-[#FFFFFF] shadow-2xl z-50 flex flex-col border-l border-[#E0E3EB]">
        {/* Header */}
        <div className="p-4 border-b border-[#E0E3EB] flex items-center justify-between bg-[#F8F9FB]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-amber-500 text-xl filled">star</span>
            <h2 className="font-headline font-bold text-lg text-[#181c21]">
              Starred Watchlist
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-[#737687] hover:text-[#181c21] hover:bg-[#E0E3EB]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Symbol List */}
        <div className="flex-1 overflow-y-auto divide-y divide-[#E0E3EB] custom-scrollbar">
          {starredSymbols.length === 0 ? (
            <div className="p-8 text-center text-[#737687]">
              <span className="material-symbols-outlined text-4xl mb-2 text-[#E0E3EB]">star_border</span>
              <p className="font-mono-data text-xs">No starred symbols yet.</p>
              <p className="font-body text-xs text-[#6A6D78] mt-1">
                Click the star icon on any index or stock card to add it to your personal watchlist!
              </p>
            </div>
          ) : (
            starredSymbols.map((item) => {
              const isUp = item.change >= 0;
              return (
                <div
                  key={item.symbol}
                  onClick={() => {
                    onSelectSymbol(item);
                    onClose();
                  }}
                  className="p-3.5 hover:bg-[#f1f4fb] cursor-pointer flex items-center justify-between transition-colors group"
                >
                  <div className="flex items-center gap-2.5">
                    <button
                      onClick={(e) => onToggleStar(item.symbol, e)}
                      className="text-amber-500 hover:text-[#737687] p-1"
                      title="Remove from watchlist"
                    >
                      <span className="material-symbols-outlined text-lg filled">star</span>
                    </button>

                    <div>
                      <div className="font-mono-data font-bold text-xs text-[#0049db]">
                        {item.symbol}
                      </div>
                      <div className="font-body text-[11px] text-[#6A6D78] truncate max-w-[140px]">
                        {item.name}
                      </div>
                    </div>
                  </div>

                  <div className="text-right font-mono-data">
                    <div className="text-xs font-bold text-[#181c21]">
                      ${item.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </div>
                    <div
                      className={`text-[11px] font-semibold ${
                        isUp ? 'text-[#089981]' : 'text-[#F23645]'
                      }`}
                    >
                      {isUp ? '+' : ''}
                      {item.changePercent.toFixed(2)}%
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer info */}
        <div className="p-4 bg-[#F8F9FB] border-t border-[#E0E3EB] text-center font-mono-data text-xs text-[#737687]">
          {starredSymbols.length} Symbol(s) Saved
        </div>
      </div>
    </div>
  );
};
