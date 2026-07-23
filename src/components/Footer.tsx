import React from 'react';

interface FooterProps {
  onOpenScreener: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenScreener }) => {
  return (
    <footer className="bg-[#F8F9FB] border-t border-[#E0E3EB] py-12 px-6 md:px-8 mt-12">
      <div className="max-w-[1280px] mx-auto grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
        {/* Brand Column */}
        <div className="col-span-2">
          <span className="font-headline text-2xl font-black text-[#181c21] mb-4 block">
            TradingView
          </span>
          <p className="text-xs text-[#6A6D78] mb-6 leading-relaxed max-w-sm">
            Made by humans. Select market data provided by ICE Data Services. Select reference data provided by FactSet. © 2026 TradingView, Inc.
          </p>
          <div className="flex gap-4">
            <a
              href="#"
              onClick={(e) => e.preventDefault()}
              className="text-[#737687] hover:text-[#0049db] transition-colors"
            >
              <span className="material-symbols-outlined text-lg">public</span>
            </a>
            <a
              href="#"
              onClick={(e) => e.preventDefault()}
              className="text-[#737687] hover:text-[#0049db] transition-colors"
            >
              <span className="material-symbols-outlined text-lg">share</span>
            </a>
            <a
              href="#"
              onClick={(e) => e.preventDefault()}
              className="text-[#737687] hover:text-[#0049db] transition-colors"
            >
              <span className="material-symbols-outlined text-lg">alternate_email</span>
            </a>
          </div>
        </div>

        {/* Products */}
        <div>
          <h4 className="font-mono-data text-xs font-bold mb-4 uppercase text-[#737687] tracking-wider">
            Products
          </h4>
          <ul className="space-y-2 text-xs text-[#434656] font-body">
            <li>
              <button onClick={onOpenScreener} className="hover:text-[#0049db]">
                Supercharts
              </button>
            </li>
            <li>
              <button onClick={onOpenScreener} className="hover:text-[#0049db]">
                Stock Screener
              </button>
            </li>
            <li>
              <button onClick={onOpenScreener} className="hover:text-[#0049db]">
                ETF Screener
              </button>
            </li>
            <li>
              <button onClick={onOpenScreener} className="hover:text-[#0049db]">
                Crypto Screener
              </button>
            </li>
          </ul>
        </div>

        {/* Community */}
        <div>
          <h4 className="font-mono-data text-xs font-bold mb-4 uppercase text-[#737687] tracking-wider">
            Community
          </h4>
          <ul className="space-y-2 text-xs text-[#434656] font-body">
            <li>
              <a href="#" onClick={(e) => e.preventDefault()} className="hover:text-[#0049db]">
                Social network
              </a>
            </li>
            <li>
              <a href="#" onClick={(e) => e.preventDefault()} className="hover:text-[#0049db]">
                Ideas
              </a>
            </li>
            <li>
              <a href="#" onClick={(e) => e.preventDefault()} className="hover:text-[#0049db]">
                Scripts
              </a>
            </li>
            <li>
              <a href="#" onClick={(e) => e.preventDefault()} className="hover:text-[#0049db]">
                House Rules
              </a>
            </li>
          </ul>
        </div>

        {/* Apps */}
        <div>
          <h4 className="font-mono-data text-xs font-bold mb-4 uppercase text-[#737687] tracking-wider">
            Apps
          </h4>
          <ul className="space-y-2 text-xs text-[#434656] font-body">
            <li>
              <a href="#" onClick={(e) => e.preventDefault()} className="hover:text-[#0049db]">
                Mobile
              </a>
            </li>
            <li>
              <a href="#" onClick={(e) => e.preventDefault()} className="hover:text-[#0049db]">
                Desktop
              </a>
            </li>
            <li>
              <a href="#" onClick={(e) => e.preventDefault()} className="hover:text-[#0049db]">
                Features
              </a>
            </li>
          </ul>
        </div>

        {/* About */}
        <div>
          <h4 className="font-mono-data text-xs font-bold mb-4 uppercase text-[#737687] tracking-wider">
            About
          </h4>
          <ul className="space-y-2 text-xs text-[#434656] font-body">
            <li>
              <a href="#" onClick={(e) => e.preventDefault()} className="hover:text-[#0049db]">
                Who we are
              </a>
            </li>
            <li>
              <a href="#" onClick={(e) => e.preventDefault()} className="hover:text-[#0049db]">
                Blog
              </a>
            </li>
            <li>
              <a href="#" onClick={(e) => e.preventDefault()} className="hover:text-[#0049db]">
                Careers
              </a>
            </li>
            <li>
              <a href="#" onClick={(e) => e.preventDefault()} className="hover:text-[#0049db]">
                Help Center
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
};
