import React from 'react';
import { MarketCategory } from '../types';

interface HeroSubnavProps {
  selectedCategory: MarketCategory;
  onSelectCategory: (category: MarketCategory) => void;
}

export const HeroSubnav: React.FC<HeroSubnavProps> = ({
  selectedCategory,
  onSelectCategory,
}) => {
  const categories: MarketCategory[] = ['Indices', 'Stocks', 'Crypto', 'Futures', 'Forex', 'Bonds'];

  return (
    <section className="py-8 md:py-10 border-b border-[#E0E3EB]">
      <h1 className="font-headline text-3xl md:text-4xl lg:text-[38px] font-bold tracking-tight text-[#181c21] mb-6">
        Markets, everywhere
      </h1>

      {/* Horizontal Category Pill Switches */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar whitespace-nowrap">
        {categories.map((cat) => {
          const isActive = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => onSelectCategory(cat)}
              className={`px-4 py-1.5 rounded-full font-mono-data text-xs md:text-[13px] font-medium transition-all ${
                isActive
                  ? 'bg-[#0049db] text-white shadow-xs font-semibold'
                  : 'bg-[#f1f4fb] text-[#434656] hover:bg-[#ebeef5] hover:text-[#181c21]'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>
    </section>
  );
};
