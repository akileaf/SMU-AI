import React from 'react';
import { MarketCategory } from '../types';
import { X } from 'lucide-react';

interface SidebarProps {
  selectedCategory: MarketCategory;
  onSelectCategory: (category: MarketCategory) => void;
  onOpenScreener: () => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  selectedCategory,
  onSelectCategory,
  onOpenScreener,
  isMobileOpen,
  onCloseMobile,
}) => {
  const categories: { name: MarketCategory; icon: string }[] = [
    { name: 'Stocks', icon: 'trending_up' },
    { name: 'Crypto', icon: 'currency_bitcoin' },
    { name: 'Futures', icon: 'timeline' },
    { name: 'Forex', icon: 'currency_exchange' },
    { name: 'Bonds', icon: 'account_balance' },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full pt-6 bg-[#FFFFFF]">
      {/* Markets Section */}
      <div className="px-6 mb-6">
        <h3 className="font-mono-data text-[11px] font-semibold uppercase tracking-wider text-[#737687] mb-4">
          Markets
        </h3>
        <nav className="space-y-1">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.name;
            return (
              <button
                key={cat.name}
                onClick={() => {
                  onSelectCategory(cat.name);
                  onCloseMobile();
                }}
                className={`w-full flex items-center gap-3 rounded-lg px-3 py-2 transition-all font-mono-data text-xs ${
                  isActive
                    ? 'bg-[#dfe2f2] text-[#606471] font-bold shadow-xs'
                    : 'text-[#434656] hover:bg-[#f1f4fb] hover:text-[#181c21]'
                }`}
              >
                <span className={`material-symbols-outlined text-lg ${isActive ? 'text-[#0049db]' : 'text-[#737687]'}`}>
                  {cat.icon}
                </span>
                <span>{cat.name}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Screeners Section */}
      <div className="px-6 border-t border-[#E0E3EB] pt-6">
        <h3 className="font-mono-data text-[11px] font-semibold uppercase tracking-wider text-[#737687] mb-4">
          Screeners
        </h3>
        <nav className="space-y-1">
          <button
            onClick={() => {
              onOpenScreener();
              onCloseMobile();
            }}
            className="w-full text-left font-mono-data text-xs text-[#434656] py-1.5 hover:text-[#0049db] transition-colors flex items-center justify-between"
          >
            <span>Stock Screener</span>
            <span className="material-symbols-outlined text-sm text-[#737687]">filter_alt</span>
          </button>
          <button
            onClick={() => {
              onOpenScreener();
              onCloseMobile();
            }}
            className="w-full text-left font-mono-data text-xs text-[#434656] py-1.5 hover:text-[#0049db] transition-colors flex items-center justify-between"
          >
            <span>ETF Screener</span>
            <span className="material-symbols-outlined text-sm text-[#737687]">pie_chart</span>
          </button>
          <button
            onClick={() => {
              onOpenScreener();
              onCloseMobile();
            }}
            className="w-full text-left font-mono-data text-xs text-[#434656] py-1.5 hover:text-[#0049db] transition-colors flex items-center justify-between"
          >
            <span>Crypto Screener</span>
            <span className="material-symbols-outlined text-sm text-[#737687]">currency_bitcoin</span>
          </button>
        </nav>
      </div>

      <div className="mt-auto p-6 border-t border-[#E0E3EB] bg-[#F8F9FB]">
        <div className="p-3 bg-[#ffffff] border border-[#E0E3EB] rounded-lg">
          <p className="font-mono-data text-[11px] text-[#737687] font-semibold mb-1 uppercase">Trading Status</p>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#089981]">
            <span className="w-2 h-2 rounded-full bg-[#089981] animate-pulse"></span>
            Markets Open
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sticky Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 border-r border-[#E0E3EB] bg-[#FFFFFF] sticky top-16 h-[calc(100vh-64px)] overflow-y-auto custom-scrollbar flex-shrink-0">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs"
            onClick={onCloseMobile}
          />
          <div className="fixed top-0 bottom-0 left-0 w-72 bg-[#FFFFFF] z-50 flex flex-col shadow-2xl">
            <div className="p-4 border-b border-[#E0E3EB] flex items-center justify-between">
              <span className="font-headline font-bold text-lg text-[#181c21]">Menu</span>
              <button
                onClick={onCloseMobile}
                className="p-1 rounded text-[#737687] hover:text-[#181c21]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">{sidebarContent}</div>
          </div>
        </div>
      )}
    </>
  );
};
